import { useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioReadinessMessage, isAllowedOrigin } from "@/types/readiness";
import "./LaptopIntro.css";

interface LaptopIntroProps {
  children: ReactNode;
}

export default function LaptopIntro({ children }: LaptopIntroProps) {
  // Check if running inside parent Next.js iframe
  const [isInsideIframe, setIsInsideIframe] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  });

  const [phase, setPhase] = useState<"splash" | "laptop" | "expand" | "complete">(() => {
    if (typeof window === "undefined") return "splash";
    try {
      return window.self !== window.top ? "complete" : "splash";
    } catch {
      return "complete";
    }
  });

  const [scaleFactor, setScaleFactor] = useState(1);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("INITIALIZING RUNTIME ENVIRONMENT...");
  const [commandLog, setCommandLog] = useState("boot_sequence --verify-subsystems");
  const [isReady, setIsReady] = useState(false);
  const [isDegraded, setIsDegraded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasNotifiedReadyRef = useRef(false);

  // ─── Safe postMessage to parent window ───────────────────────────────────────
  const sendReadinessMessage = useCallback(
    (stage: PortfolioReadinessMessage["payload"]["stage"], pct: number, text: string) => {
      if (typeof window === "undefined" || window.self === window.top) return;

      const message: PortfolioReadinessMessage = {
        source: "durgesh-portfolio-vite",
        version: 1,
        type: pct >= 100 ? "PORTFOLIO_READY" : "PORTFOLIO_PROGRESS",
        payload: {
          stage,
          progress: pct,
          statusText: text,
          timestamp: Date.now(),
        },
      };

      // Determine parent target origin safely without wildcard fallback
      let targetOrigin = "";
      if (document.referrer) {
        try {
          const refOrigin = new URL(document.referrer).origin;
          if (isAllowedOrigin(refOrigin)) {
            targetOrigin = refOrigin;
          }
        } catch {
          // ignore parsing error
        }
      }

      if (!targetOrigin && typeof window !== "undefined") {
        const ancestors = (window.location as unknown as { ancestorOrigins?: DOMStringList }).ancestorOrigins;
        if (ancestors && ancestors.length > 0 && isAllowedOrigin(ancestors[0])) {
          targetOrigin = ancestors[0];
        }
      }

      // If origin cannot be determined from referrer or ancestorOrigins, fallback to known parent origin
      if (!targetOrigin && typeof window !== "undefined") {
        const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(window.location.origin);
        if (isLocal) {
          targetOrigin = "http://localhost:3000";
        } else {
          targetOrigin = "https://durgesh729.vercel.app";
        }
      }

      // Strict enforcement: Only send if targetOrigin is verified and allowed
      if (!targetOrigin || !isAllowedOrigin(targetOrigin)) {
        return;
      }

      try {
        window.parent.postMessage(message, targetOrigin);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("[Vite Readiness] postMessage dispatch failed:", err);
        }
      }
    },
    []
  );

  // ─── Reset Scroll & Prevent Browser Auto-Scroll Restoration on Reload ──────
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true });
      }
    };

    resetScroll();
    const rafId = requestAnimationFrame(resetScroll);
    const timeoutId = setTimeout(resetScroll, 120);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  // ─── Responsive Scale Calculation ───────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / 518;
      const scaleY = h / 318;
      setScaleFactor(Math.max(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // ─── Genuine Readiness Pipeline ──────────────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;

    // Stage 1: Mount verification (15%)
    setProgress(20);
    setStatusText("CLIENT RUNTIME MOUNTED");
    setCommandLog("sys_check: verifying dom tree and styles...");
    sendReadinessMessage("init", 20, "Client runtime mounted");

    // Stage 2: Fonts readiness (40%)
    const checkFonts = async () => {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // fallback gracefully
        }
      }
      if (isCancelled) return;

      setProgress((prev) => Math.max(prev, 45));
      setStatusText("SYSTEM TYPOGRAPHY RESOLVED");
      setCommandLog("font_loader: cached Plus Jakarta Sans & Caveat");
      sendReadinessMessage("fonts", 45, "System typography resolved");
    };

    // Stage 3: Hero visual first-frame readiness (75%)
    const handleHeroReady = () => {
      if (isCancelled || hasNotifiedReadyRef.current) return;
      setProgress((prev) => Math.max(prev, 75));
      setStatusText("HERO FRAME SEQUENCE READY");
      setCommandLog("canvas_render: frame_000000 decoded & drawn");
      sendReadinessMessage("hero_frame", 75, "Hero sequence frame 0 ready");

      // Stage 4: Critical layout stabilization (90%)
      setTimeout(() => {
        if (isCancelled || hasNotifiedReadyRef.current) return;
        setProgress((prev) => Math.max(prev, 90));
        setStatusText("LAYOUT STABILIZED");
        setCommandLog("render_pipeline: all critical metrics nominal");
        sendReadinessMessage("critical_components", 90, "Critical components mounted");

        // Stage 5: Final completion (100%)
        setTimeout(() => {
          if (isCancelled || hasNotifiedReadyRef.current) return;
          hasNotifiedReadyRef.current = true;
          setProgress(100);
          setIsReady(true);
          setStatusText("SYSTEM READY - ALL SUBSYSTEMS NOMINAL");
          setCommandLog("status: ready for portfolio launch");
          sendReadinessMessage("ready", 100, "All systems nominal");
        }, 120);
      }, 50);
    };

    // Listen for parent ping to immediately resend current state
    const handleParentPing = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin)) return;
      const data = event.data;
      if (data && data.source === "durgesh-portfolio-entry" && data.type === "PORTFOLIO_PING") {
        if (hasNotifiedReadyRef.current) {
          sendReadinessMessage("ready", 100, "All systems nominal");
        } else {
          sendReadinessMessage("init", 50, "Child initializing");
        }
      }
    };
    window.addEventListener("message", handleParentPing);

    if (typeof window !== "undefined" && (window as unknown as { __HERO_INITIAL_FRAME_READY__?: boolean }).__HERO_INITIAL_FRAME_READY__) {
      handleHeroReady();
    } else {
      window.addEventListener("hero:initial-ready", handleHeroReady);
    }
    checkFonts();

    // Safety Fallback: If critical assets fail or time out after 8s, enable degraded entry truthfully
    const degradedTimer = setTimeout(() => {
      if (!isCancelled && !hasNotifiedReadyRef.current) {
        hasNotifiedReadyRef.current = true;
        setIsDegraded(true);
        setIsReady(true);
        setProgress(100);
        setStatusText("DEGRADED MODE - ASSET TIMEOUT");
        setCommandLog("warning: asset decode delayed; enabling degraded launch");
        sendReadinessMessage("error", 100, "Degraded timeout fallback");
      }
    }, 8000);

    return () => {
      isCancelled = true;
      window.removeEventListener("hero:initial-ready", handleHeroReady);
      window.removeEventListener("message", handleParentPing);
      clearTimeout(degradedTimer);
    };
  }, [sendReadinessMessage]);

  const handleEnterExperience = () => {
    if (!isReady) return;

    // Reset scroll to top before opening laptop
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(0, { immediate: true });
    }

    // 1. Play intro audio on explicit user interaction
    try {
      const audio = new Audio("/intro-music.mp3");
      audio.volume = 0.65;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {}

    // 2. Transition immediately into 3D laptop opening animation
    setPhase("laptop");

    // 3. Run laptop opening & terminal sequence for 4s, then expand to full screen
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase("expand");
      window.scrollTo(0, 0);
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true });
      }

      setTimeout(() => {
        setPhase("complete");
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(0, { immediate: true });
        }
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("resize"));
        }
      }, 1600);
    }, 4000);
  };

  const handleAnimationComplete = () => {
    if (phase === "expand") {
      setPhase("complete");
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true });
      }
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("resize"));
      }
    }
  };

  // If inside an iframe, suppress the duplicate splash screen completely!
  if (isInsideIframe) {
    return (
      <div className="w-full min-h-screen relative z-10 fade-in-content">
        {children}
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${phase === "complete" ? "" : "bg-black overflow-hidden select-none"}`}>
      {/* ── PHASE 1: DEVELOPER TERMINAL PRE-ENTRY LOADER ── */}
      {phase === "splash" && (
        <div
          data-exclude-cursor="true"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white px-4 select-none overflow-hidden"
          role="region"
          aria-label="Portfolio initialization loader"
        >
          {/* Ambient Glow Orbs */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none -top-20 -left-20" />
          <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none -bottom-20 -right-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center text-center max-w-xl w-full"
          >
            {/* Screen Reader Status Announcement */}
            <div className="sr-only" aria-live="polite">
              {statusText} - {commandLog} - {Math.round(progress)}%
            </div>

            {/* Name & Title */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent mb-2 font-sans">
              DURGESH PADVAL
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal mb-8 max-w-md">
              Data Analyst & Machine Learning Student
            </p>

            {/* 100-PIXEL PROGRESS GRID TRANSFORMS INTO ENTER EXPERIENCE BUTTON OF EXACT SAME SIZE AT 100% */}
            <div className="w-[90%] max-w-[380px] h-[58px] mx-auto relative flex items-center justify-center">
              <AnimatePresence mode="wait">
                {!isReady ? (
                  <motion.div
                    key="progress-grid"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="progress-container !m-0 !p-0 !w-full !max-w-none h-full flex items-center justify-center"
                  >
                    <div
                      className="progress-grid w-full h-full flex items-center justify-center"
                      role="progressbar"
                      aria-valuenow={Math.round(progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Portfolio readiness progress"
                    >
                      {Array.from({ length: 100 }, (_, i) => (
                        <div
                          key={i}
                          className={`pixel ${i < Math.round(progress) ? "active" : "resting"}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="enter-experience-btn"
                    initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    <button
                      type="button"
                      onClick={handleEnterExperience}
                      className="w-full h-full rounded-[16px] font-semibold text-sm sm:text-base tracking-wider uppercase transition-all duration-300 cursor-pointer bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_35px_-5px_rgba(255,255,255,0.5)] hover:shadow-[0_0_50px_0_rgba(255,255,255,0.6)] flex items-center justify-center border border-neutral-200"
                    >
                      {isDegraded ? "ENTER EXPERIENCE (DEGRADED)" : "ENTER EXPERIENCE"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── PHASE 2 & 3: 3D LAPTOP OPENING & SCREEN EXPANSION ── */}
      {phase !== "splash" && phase !== "complete" && (
        <div data-exclude-cursor="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
          <motion.div
            className={`laptop ${phase === "expand" ? "expanding" : ""}`}
            initial={{ scale: 0.8 }}
            animate={phase === "expand" ? { scale: scaleFactor } : { scale: 0.8 }}
            transition={{ duration: 1.5, ease: [0.6, 0.05, -0.01, 0.9] }}
            onAnimationComplete={handleAnimationComplete}
          >
            <div className={`screen ${phase === "expand" ? "expanding" : ""}`}>
              <div className="laptop-header" />

              {/* Terminal status inside laptop during opening */}
              <div className="terminal-loader">
                <div className="terminal-header">
                  <div className="terminal-title">Status</div>
                  <div className="terminal-controls">
                    <div className="terminal-control close" />
                    <div className="terminal-control minimize" />
                    <div className="terminal-control maximize" />
                  </div>
                </div>
                <div className="terminal-text">Launching Durgesh's Portfolio...</div>
              </div>
            </div>

            <div className="keyboard" />
          </motion.div>
        </div>
      )}

      {/* ── PRE-MOUNTED CONTENT (Eliminates layout shifts and blank frames upon entry) ── */}
      <div
        className={`w-full min-h-screen relative z-10 ${
          phase === "complete" ? "fade-in-content" : "pointer-events-none"
        }`}
        style={{
          visibility: phase === "complete" ? "visible" : "hidden",
          position: phase === "complete" ? "relative" : "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
        aria-hidden={phase !== "complete"}
      >
        {children}
      </div>
    </div>
  );
}
