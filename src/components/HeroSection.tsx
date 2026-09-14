import { useEffect, useRef, useState } from "react";
import "./HeroSection.css";

// ─── Frame Config ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES  = 112;    // actual frame count (frame_000000.jpg to frame_000111.jpg is 112 frames)
const FRAME_START   = 0;      // first file index: 0
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
  const rafIdRef        = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);

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
    
    // Draw only if frame index changed
    if (index === lastDrawnFrameRef.current) return;

    const img = imagesRef.current[index];
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
    lastDrawnFrameRef.current = index;
  };

  // ─── Loop Control Functions ──────────────────────────────────────────────────
  const stopLoop = () => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  };

  const loop = () => {
    if (!isVisibleRef.current) {
      stopLoop();
      return;
    }

    const diff = targetFrameRef.current - currentFrameRef.current;
    if (Math.abs(diff) > 0.05) {
      currentFrameRef.current += diff * 0.15;
      drawFrame(Math.round(currentFrameRef.current));
      rafIdRef.current = requestAnimationFrame(loop);
    } else {
      currentFrameRef.current = targetFrameRef.current;
      drawFrame(targetFrameRef.current);
      stopLoop(); // Stop requestAnimationFrame when animation settles
    }
  };

  const startLoop = () => {
    if (rafIdRef.current === null && isVisibleRef.current) {
      rafIdRef.current = requestAnimationFrame(loop);
    }
  };

  // ─── Scroll-Bound Canvas Frame Mapping ─────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Derive scroll range from viewport height so animation completes
      // at the same visual proportion regardless of screen size.
      const scrollRange = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));
      const nextTarget = Math.round(progress * (TOTAL_FRAMES - 1));

      if (nextTarget !== targetFrameRef.current) {
        targetFrameRef.current = nextTarget;
        startLoop();
      }

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
      stopLoop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // ─── Frame Loader ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadFrame = (index: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        const num = (FRAME_START + index).toString().padStart(6, "0");
        img.src   = `/herosectionframes/frame_${num}.webp`;
        
        // Decode off-main-thread to avoid UI micro-stutters during loading
        img.decode()
          .then(() => {
            imagesRef.current[index] = img;
            if (index > maxLoadedRef.current) maxLoadedRef.current = index;
            if (index === 0) drawFrame(0);

            // Race-condition fix: if the RAF loop already converged while this
            // frame was still decoding, the canvas may be stuck on an earlier
            // frame. Nudge a redraw now that this frame is available.
            if (rafIdRef.current === null && index <= targetFrameRef.current) {
              drawFrame(Math.round(currentFrameRef.current));
            }
            resolve();
          })
          .catch(() => {
            // Fallback for older browsers or loading/decoding failure
            imagesRef.current[index] = img;
            if (index > maxLoadedRef.current) maxLoadedRef.current = index;
            if (index === 0) drawFrame(0);

            // Same nudge in the error/fallback path
            if (rafIdRef.current === null && index <= targetFrameRef.current) {
              drawFrame(Math.round(currentFrameRef.current));
            }
            resolve();
          });
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
  }, []);

  // ─── Visibility Tracking with IntersectionObserver ────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        isVisibleRef.current = visible;
        setIsVisible(visible);

        if (visible) {
          // Restart animation loop if target frame has not been reached yet
          if (Math.abs(targetFrameRef.current - currentFrameRef.current) > 0.05) {
            startLoop();
          }
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      stopLoop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // ─── Resize ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      lastDrawnFrameRef.current = -1; // Reset to force redraw at new size
      drawFrame(Math.round(currentFrameRef.current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
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
