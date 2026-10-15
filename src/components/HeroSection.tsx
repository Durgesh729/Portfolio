import { useEffect, useRef, useState, useCallback } from "react";
import "./HeroSection.css";

// ─── Frame Config ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 112; // frame_000000.webp to frame_000111.webp (112 frames)
const FRAME_START = 0;
const INITIAL_BUFFER_COUNT = 4; // Nearby frames to buffer immediately after frame 0
const MAX_CONCURRENT_FETCHES = 2; // Bounded concurrency queue to protect network

interface HeroSectionProps {
  onInitialFrameReady?: () => void;
}

const HeroSection = ({ onInitialFrameReady }: HeroSectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const loadingSetRef = useRef<Set<number>>(new Set());
  const failedSetRef = useRef<Set<number>>(new Set());
  const activeFetchesRef = useRef<number>(0);
  const queueRef = useRef<number[]>([]);
  const idleCallbackIdRef = useRef<number | null>(null);

  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const scrollDirectionRef = useRef<1 | -1>(1);
  const lastScrollYRef = useRef(0);

  const [initialFrameReady, setInitialFrameReady] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const isVisibleRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Respect prefers-reduced-motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ─── Find Best Loaded Frame Fallback ───────────────────────────────────────────
  const getClosestLoadedFrame = useCallback((targetIndex: number): number | null => {
    const images = imagesRef.current;
    if (images[targetIndex]) return targetIndex;

    // Search outwards from targetIndex (e.g. ±1, ±2, ±3...)
    const maxRadius = Math.max(targetIndex, TOTAL_FRAMES - 1 - targetIndex);
    for (let r = 1; r <= maxRadius; r++) {
      const forward = targetIndex + r;
      if (forward < TOTAL_FRAMES && images[forward]) return forward;
      const backward = targetIndex - r;
      if (backward >= 0 && images[backward]) return backward;
    }
    return null;
  }, []);

  // ─── Canvas Draw ─────────────────────────────────────────────────────────────
  const drawFrame = useCallback((rawIndex: number) => {
    if (!isVisibleRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const bounded = Math.max(0, Math.min(TOTAL_FRAMES - 1, rawIndex));
    const bestIndex = getClosestLoadedFrame(bounded);
    if (bestIndex === null) return;

    // Draw only if rendered index changed
    if (bestIndex === lastDrawnFrameRef.current) return;

    const img = imagesRef.current[bestIndex];
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for performance
    const W = window.innerWidth;
    const H = window.innerHeight;
    const bufW = Math.round(W * dpr);
    const bufH = Math.round(H * dpr);

    if (canvas.width !== bufW || canvas.height !== bufH) {
      canvas.width = bufW;
      canvas.height = bufH;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "medium";

    const cr = W / H;
    const ir = (img.naturalWidth || 16) / (img.naturalHeight || 9);
    let dw: number, dh: number, dx: number, dy: number;
    if (cr > ir) {
      dw = W;
      dh = W / ir;
      dx = 0;
      dy = (H - dh) / 2;
    } else {
      dh = H;
      dw = H * ir;
      dx = (W - dw) / 2;
      dy = 0;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawnFrameRef.current = bestIndex;

    if (!canvasReady) {
      setCanvasReady(true);
    }
  }, [canvasReady, getClosestLoadedFrame]);

  // ─── RAF Scrub Loop ──────────────────────────────────────────────────────────
  const stopLoop = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const loop = useCallback(() => {
    if (!isVisibleRef.current) {
      stopLoop();
      return;
    }

    const diff = targetFrameRef.current - currentFrameRef.current;
    if (Math.abs(diff) > 0.05) {
      currentFrameRef.current += diff * 0.18;
      drawFrame(Math.round(currentFrameRef.current));
      rafIdRef.current = requestAnimationFrame(loop);
    } else {
      currentFrameRef.current = targetFrameRef.current;
      drawFrame(targetFrameRef.current);
      stopLoop();
    }
  }, [drawFrame, stopLoop]);

  const startLoop = useCallback(() => {
    if (rafIdRef.current === null && isVisibleRef.current) {
      rafIdRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  // ─── Single Frame Loader with Off-thread decode ──────────────────────────────
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (imagesRef.current[index]) {
      return Promise.resolve(imagesRef.current[index]);
    }

    if (loadingSetRef.current.has(index)) {
      return Promise.resolve(null);
    }

    loadingSetRef.current.add(index);
    const num = (FRAME_START + index).toString().padStart(6, "0");
    const img = new Image();
    img.src = `/herosectionframes/frame_${num}.webp`;

    return img
      .decode()
      .then(() => {
        imagesRef.current[index] = img;
        loadingSetRef.current.delete(index);
        return img;
      })
      .catch(() => {
        // Fallback for decode error
        imagesRef.current[index] = img;
        loadingSetRef.current.delete(index);
        return img;
      });
  }, []);

  // ─── Bounded Queue Pump ─────────────────────────────────────────────────────
  const processQueue = useCallback(() => {
    if (!isVisibleRef.current) return;

    while (
      activeFetchesRef.current < MAX_CONCURRENT_FETCHES &&
      queueRef.current.length > 0
    ) {
      const nextIndex = queueRef.current.shift();
      if (nextIndex === undefined || imagesRef.current[nextIndex]) continue;

      activeFetchesRef.current++;
      loadFrame(nextIndex)
        .then((loadedImg) => {
          activeFetchesRef.current--;
          if (loadedImg && isVisibleRef.current) {
            // If this frame corresponds to current target, re-draw
            if (
              Math.abs(Math.round(currentFrameRef.current) - nextIndex) <= 1 &&
              rafIdRef.current === null
            ) {
              drawFrame(Math.round(currentFrameRef.current));
            }
          }
          processQueue();
        })
        .catch(() => {
          activeFetchesRef.current--;
          failedSetRef.current.add(nextIndex);
          processQueue();
        });
    }
  }, [drawFrame, loadFrame]);

  // ─── Scroll-Aware Queue Prioritization ──────────────────────────────────────
  const prioritizeUpcomingFrames = useCallback((centerIndex: number, direction: 1 | -1) => {
    const unrequested: number[] = [];

    // Window 1: Immediate proximity in scroll direction (highest priority)
    for (let i = 1; i <= 8; i++) {
      const idx = centerIndex + i * direction;
      if (idx >= 0 && idx < TOTAL_FRAMES && !imagesRef.current[idx] && !loadingSetRef.current.has(idx)) {
        unrequested.push(idx);
      }
    }

    // Window 2: Immediate opposite direction (for scrubbing reversal)
    for (let i = 1; i <= 4; i++) {
      const idx = centerIndex - i * direction;
      if (idx >= 0 && idx < TOTAL_FRAMES && !imagesRef.current[idx] && !loadingSetRef.current.has(idx)) {
        unrequested.push(idx);
      }
    }

    // Window 3: Wider window in scroll direction
    for (let i = 9; i <= 18; i++) {
      const idx = centerIndex + i * direction;
      if (idx >= 0 && idx < TOTAL_FRAMES && !imagesRef.current[idx] && !loadingSetRef.current.has(idx)) {
        unrequested.push(idx);
      }
    }

    // Update queue prioritizing immediate needs
    const newQueue = [...new Set([...unrequested, ...queueRef.current])];
    queueRef.current = newQueue;
    processQueue();
  }, [processQueue]);

  // ─── Critical Initialization: Load Frame 0 First ────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    // Calculate initial frame based on scroll position on mount
    const initialScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollRange = typeof window !== "undefined" ? window.innerHeight : 800;
    const initialProgress = Math.min(1, Math.max(0, initialScrollY / scrollRange));
    const initialIndex = Math.round(initialProgress * (TOTAL_FRAMES - 1));

    currentFrameRef.current = initialIndex;
    targetFrameRef.current = initialIndex;

    // Load initial visible frame first
    loadFrame(initialIndex).then((img) => {
      if (isCancelled || !img) return;

      setInitialFrameReady(true);
      drawFrame(initialIndex);

      if (onInitialFrameReady) {
        onInitialFrameReady();
      }
      if (typeof window !== "undefined") {
        (window as unknown as { __HERO_INITIAL_FRAME_READY__?: boolean }).__HERO_INITIAL_FRAME_READY__ = true;
        window.dispatchEvent(
          new CustomEvent("hero:initial-ready", {
            detail: { frameIndex: initialIndex },
          })
        );
      }

      // Preload immediate buffer around initial frame
      const bufferPromises: Promise<unknown>[] = [];
      for (let i = 1; i <= INITIAL_BUFFER_COUNT; i++) {
        if (initialIndex + i < TOTAL_FRAMES) {
          bufferPromises.push(loadFrame(initialIndex + i));
        }
        if (initialIndex - i >= 0) {
          bufferPromises.push(loadFrame(initialIndex - i));
        }
      }

      Promise.all(bufferPromises).then(() => {
        if (isCancelled) return;
        // Schedule progressive idle loading for remaining frames
        scheduleIdlePrefetch();
      });
    });

    const scheduleIdlePrefetch = () => {
      const runIdle = () => {
        if (isCancelled || !isVisibleRef.current) return;
        const missing: number[] = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          if (!imagesRef.current[i] && !loadingSetRef.current.has(i)) {
            missing.push(i);
          }
        }
        if (missing.length > 0) {
          queueRef.current = [...new Set([...queueRef.current, ...missing])];
          processQueue();
        }
      };

      if ("requestIdleCallback" in window) {
        idleCallbackIdRef.current = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
          runIdle,
          { timeout: 3000 }
        );
      } else {
        idleCallbackIdRef.current = window.setTimeout(runIdle, 1000);
      }
    };

    return () => {
      isCancelled = true;
      if (idleCallbackIdRef.current !== null) {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleCallbackIdRef.current);
        } else {
          clearTimeout(idleCallbackIdRef.current);
        }
      }
    };
  }, [drawFrame, loadFrame, onInitialFrameReady, processQueue]);

  // ─── Scroll-Bound Canvas Frame Mapping ─────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollYRef.current;
      if (Math.abs(scrollDelta) > 1) {
        scrollDirectionRef.current = scrollDelta > 0 ? 1 : -1;
      }
      lastScrollYRef.current = scrollY;

      const scrollRange = window.innerHeight;
      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));
      const nextTarget = Math.round(progress * (TOTAL_FRAMES - 1));

      if (nextTarget !== targetFrameRef.current) {
        targetFrameRef.current = nextTarget;
        prioritizeUpcomingFrames(nextTarget, scrollDirectionRef.current);
        startLoop();
      }

      // Gradual opacity fade-out as About section rises
      if (sectionRef.current) {
        if (scrollY > 1000) {
          const fadeProgress = Math.min(1, (scrollY - 1000) / 600);
          sectionRef.current.style.opacity = (1 - fadeProgress).toString();
        } else {
          sectionRef.current.style.opacity = "1";
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      stopLoop();
    };
  }, [prioritizeUpcomingFrames, reducedMotion, startLoop, stopLoop]);

  // ─── Visibility Tracking with IntersectionObserver ────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        isVisibleRef.current = visible;
        setIsVisible(visible);

        if (visible) {
          if (Math.abs(targetFrameRef.current - currentFrameRef.current) > 0.05) {
            startLoop();
          }
          processQueue();
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
  }, [processQueue, reducedMotion, startLoop, stopLoop]);

  // ─── Resize Handling ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      lastDrawnFrameRef.current = -1;
      drawFrame(Math.round(currentFrameRef.current));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [drawFrame]);

  return (
    <section id="home" ref={sectionRef} className="relative h-screen hero-section">
      <div className="relative w-full h-full overflow-hidden">
        {/* Instant Above-the-Fold LCP Image */}
        <img
          src="/herosectionframes/frame_000000.webp"
          alt="Hero visual sequence initial frame"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="sync"
          className="hero-initial-poster"
          style={{
            opacity: canvasReady ? 0 : 1,
            pointerEvents: "none",
          }}
        />

        {/* Canvas – full-screen cinematic background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block pointer-events-none transition-opacity duration-500"
          style={{
            opacity: canvasReady ? 1 : 0,
            zIndex: 1,
            display: isVisible ? "block" : "none",
          }}
        />

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#d6d7d7]/10 via-transparent to-[#d6d7d7]/10 pointer-events-none z-[2]"
        />
      </div>
    </section>
  );
};

export default HeroSection;
