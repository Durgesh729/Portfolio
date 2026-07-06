import { useEffect, useRef, useState } from "react";
import "./HeroSection.css";

// ─── Frame Config ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES  = 139;    // actual frame count (002.jpg to 140.jpg is 139 frames)
const FRAME_START   = 2;      // first file: 002.jpg
const STAGE1_COUNT  = 5;      // frames to load before revealing canvas

const HeroSection = () => {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const imagesRef       = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef  = useRef(0);
  const maxLoadedRef    = useRef(-1);
  const [ready, setReady] = useState(false);
  const sectionRef      = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef    = useRef(true);

  // ─────────────────────────────────────────────────────────────────────────────
  // Respect prefers-reduced-motion
  // ─────────────────────────────────────────────────────────────────────────────
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ─── Canvas Draw ─────────────────────────────────────────────────────────────
  const drawFrame = (rawIndex: number) => {
    if (!isVisibleRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const index = Math.max(0, Math.min(rawIndex, maxLoadedRef.current));
    const img   = imagesRef.current[index];
    if (!img) return;

    const dpr  = window.devicePixelRatio || 1;
    const W    = window.innerWidth;
    const H    = window.innerHeight;
    const bufW = Math.round(W * dpr);
    const bufH = Math.round(H * dpr);

    if (canvas.width !== bufW || canvas.height !== bufH) {
      canvas.width        = bufW;
      canvas.height       = bufH;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cr = W / H;
    const ir = img.naturalWidth / img.naturalHeight;
    let dw: number, dh: number, dx: number, dy: number;
    if (cr > ir) { dw = W; dh = W / ir; dx = 0;            dy = (H - dh) / 2; }
    else          { dh = H; dw = H * ir; dx = (W - dw) / 2; dy = 0;            }

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // ─── Scroll-Bound Canvas Frame Mapping ─────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollRange = 1000; // Matches parent height scroll padding
      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));
      targetFrameRef.current = Math.round(progress * (TOTAL_FRAMES - 1));

      // Gradual opacity fade-out as the About section rises (past Y=1000px)
      if (sectionRef.current) {
        if (scrollY > 1000) {
          const fadeProgress = Math.min(1, (scrollY - 1000) / 600); // fade out over 600px of scroll
          sectionRef.current.style.opacity = (1 - fadeProgress).toString();
        } else {
          sectionRef.current.style.opacity = "1";
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Set initial frame based on scroll position on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Frame Loader ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadFrame = (index: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        const num = (FRAME_START + index).toString().padStart(3, "0");
        img.src   = `/herosectionframes/${num}.webp`;
        img.onload = () => {
          imagesRef.current[index] = img;
          if (index > maxLoadedRef.current) maxLoadedRef.current = index;
          if (index === 0) drawFrame(0);
          resolve();
        };
        img.onerror = () => resolve();
      });

    const loadAll = async () => {
      // Stage 1: Load first few frames to show initial frame quickly
      await Promise.all(Array.from({ length: STAGE1_COUNT }, (_, i) => loadFrame(i)));
      setReady(true);
      
      // Stage 2: Load the remaining frames in batches of 6 (concurrency limit)
      const batchSize = 6;
      for (let i = STAGE1_COUNT; i < TOTAL_FRAMES; i += batchSize) {
        const batch = [];
        for (let j = 0; j < batchSize && i + j < TOTAL_FRAMES; j++) {
          batch.push(loadFrame(i + j));
        }
        await Promise.all(batch);
      }
    };

    loadAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Visibility Tracking for Performance Optimization ──────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 1000 + window.innerHeight; // Keep canvas visible throughout transition
      const visible = scrollY < threshold;
      if (visible !== isVisibleRef.current) {
        isVisibleRef.current = visible;
        setIsVisible(visible);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [reducedMotion]);

  // ─── RAF Loop (smooth interpolation) ─────────────────────────────────────────
  useEffect(() => {
    let rafId: number;
    const loop = () => {
      if (isVisibleRef.current) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.05) {
          currentFrameRef.current += diff * 0.15;
          drawFrame(Math.round(currentFrameRef.current));
        } else {
          currentFrameRef.current = targetFrameRef.current;
          drawFrame(targetFrameRef.current);
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Resize ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => drawFrame(Math.round(currentFrameRef.current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen hero-section"
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Canvas – full-screen cinematic background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block pointer-events-none transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0, zIndex: 0, display: isVisible ? "block" : "none" }}
        />

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#d6d7d7]/10 via-transparent to-[#d6d7d7]/10 pointer-events-none z-[1]"
        />
      </div>

    </section>
  );
};

export default HeroSection;
