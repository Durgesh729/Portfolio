'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioReadinessMessage, isAllowedOrigin } from '@/types/readiness';

export default function ScrollExpandMedia({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'splash' | 'laptop' | 'expand' | 'complete'>('splash');
  const [scaleFactor, setScaleFactor] = useState(1);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('CONNECTING TO PORTFOLIO ENGINE...');
  const [commandLog, setCommandLog] = useState('handshake: mounting embedded portfolio instance');
  const [isReady, setIsReady] = useState(false);
  const [isDegraded, setIsDegraded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const hasReceivedReadyRef = useRef(false);

  // Resize calculation
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / 518;
      const scaleY = h / 318;
      setScaleFactor(Math.max(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // ─── PostMessage Readiness Listener from Vite Iframe ──────────────────────────
  useEffect(() => {
    let isCancelled = false;

    const handleMessage = (event: MessageEvent) => {
      // 1. Origin verification
      if (!isAllowedOrigin(event.origin)) {
        return;
      }

      // 2. Source verification: Strictly ensure message originates from our embedded iframe
      const iframeEl = iframeContainerRef.current?.querySelector('iframe');
      if (!iframeEl || !iframeEl.contentWindow || event.source !== iframeEl.contentWindow) {
        return;
      }

      // 3. Schema verification
      const data = event.data as PortfolioReadinessMessage | undefined;
      if (!data || data.source !== 'durgesh-portfolio-vite' || data.version !== 1) {
        return;
      }

      if (isCancelled) return;

      const { stage, progress: viteProgress, statusText: viteStatus } = data.payload;

      setProgress((prev) => Math.max(prev, Math.min(100, viteProgress)));

      if (stage === 'init') {
        setStatusText('VITE RUNTIME INITIALIZED');
        setCommandLog('remote_init: react virtual dom tree connected');
      } else if (stage === 'fonts') {
        setStatusText('TYPOGRAPHY & FONTS LOADED');
        setCommandLog('remote_fonts: cached webfonts resolved');
      } else if (stage === 'hero_frame') {
        setStatusText('HERO FRAME 0 DECODED & READY');
        setCommandLog('remote_canvas: first sequence frame ready');
      } else if (stage === 'critical_components') {
        setStatusText('PORTFOLIO COMPONENTS COMPILED');
        setCommandLog('remote_layout: navigation & about sections ready');
      } else if (stage === 'error' || data.type === 'PORTFOLIO_ERROR') {
        hasReceivedReadyRef.current = true;
        setIsDegraded(true);
        setIsReady(true);
        setProgress(100);
        setStatusText('CHILD ASSET TIMEOUT (DEGRADED MODE)');
        setCommandLog('warning: child signaled degraded asset fallback');
      } else if (stage === 'ready' || data.type === 'PORTFOLIO_READY') {
        hasReceivedReadyRef.current = true;
        setProgress(100);
        setIsReady(true);
        setStatusText('SYSTEM READY - 100% NOMINAL');
        setCommandLog('status: ready for portfolio launch');
      } else if (viteStatus) {
        setStatusText(viteStatus.toUpperCase());
      }
    };

    window.addEventListener('message', handleMessage);

    // Proactively ping child iframe to trigger handshake in case child booted before listener
    const pingInterval = setInterval(() => {
      if (isCancelled || hasReceivedReadyRef.current) {
        clearInterval(pingInterval);
        return;
      }
      const iframeEl = iframeContainerRef.current?.querySelector('iframe');
      if (iframeEl && iframeEl.contentWindow) {
        try {
          const targetOrigin = iframeEl.src ? new URL(iframeEl.src).origin : 'https://portfolio729.vercel.app';
          if (isAllowedOrigin(targetOrigin)) {
            iframeEl.contentWindow.postMessage(
              {
                source: 'durgesh-portfolio-entry',
                version: 1,
                type: 'PORTFOLIO_PING',
                timestamp: Date.now(),
              },
              targetOrigin
            );
          }
        } catch {
          // ignore origin parsing error
        }
      }
    }, 400);

    // Fallback: If no handshake within 8s, enable degraded entry truthfully
    const fallbackTimeout = setTimeout(() => {
      if (!isCancelled && !hasReceivedReadyRef.current) {
        hasReceivedReadyRef.current = true;
        setIsDegraded(true);
        setIsReady(true);
        setProgress(100);
        setStatusText('DEGRADED MODE - TIMEOUT EXCEEDED');
        setCommandLog('warning: iframe handshake timed out; proceeding with available assets');
      }
    }, 8000);

    return () => {
      isCancelled = true;
      window.removeEventListener('message', handleMessage);
      clearInterval(pingInterval);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  const handleEnterExperience = () => {
    if (!isReady) return;

    // 1. Start audio synchronously on direct user click (guaranteed 100% browser approval)
    try {
      const audio = new Audio('/intro-music.mp3');
      audio.volume = 0.65;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {}

    // 2. Transition immediately into laptop opening animation
    setPhase('laptop');

    // 3. Start 4-second sequence before zooming into full portfolio
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase('expand');
      setTimeout(() => {
        setPhase('complete');
      }, 1600);
    }, 4000);
  };

  const handleAnimationComplete = () => {
    if (phase === 'expand') {
      setPhase('complete');
    }
  };

  return (
    <section className={`min-h-screen bg-black overflow-hidden ${phase === 'complete' ? 'overflow-visible h-auto flex-col' : 'flex items-center justify-center fixed inset-0 z-50'}`}>

      {/* ── PHASE 1: DEVELOPER TERMINAL PRE-ENTRY LOADER ── */}
      {phase === 'splash' && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white px-4 select-none overflow-hidden">
          {/* Ambient Glow Orbs */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none -top-20 -left-20" />
          <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none -bottom-20 -right-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
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
                          className={`pixel ${i < Math.round(progress) ? 'active' : 'resting'}`}
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

      {/* ── PHASE 2 & 3: LAPTOP 3D OPENING & EXPANSION ── */}
      {phase !== 'splash' && phase !== 'complete' && (
        <motion.div
          className={`laptop ${phase === 'expand' ? 'expanding' : ''}`}
          initial={{ scale: 0.8 }}
          animate={phase === 'expand' ? { scale: scaleFactor } : { scale: 0.8 }}
          transition={{ duration: 1.5, ease: [0.6, 0.05, -0.01, 0.9] }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div className={`screen ${phase === 'expand' ? 'expanding' : ''}`}>
            <div className="header" />

            {/* TERMINAL LOADER */}
            <div className="terminal-loader">
              <div className="terminal-header">
                <div className="terminal-title">Status</div>
                <div className="terminal-controls">
                  <div className="control close"></div>
                  <div className="control minimize"></div>
                  <div className="control maximize"></div>
                </div>
              </div>
              <div className="text">Launching Durgesh&apos;s Portfolio...</div>
            </div>
          </div>

          <div className="keyboard" />
        </motion.div>
      )}

      {/* ── PRE-MOUNTED BACKGROUND IFRAME CONTAINER ── */}
      {/*
        The iframe is mounted from 0ms so the child Vite app boots up and loads
        its critical assets in parallel with the user viewing the terminal splash loader.
      */}
      <div
        ref={iframeContainerRef}
        className={`w-full h-full relative z-10 transition-opacity duration-700 ${
          phase === 'complete' ? 'fade-in-content opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{
          position: phase === 'complete' ? 'relative' : 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        aria-hidden={phase !== 'complete'}
      >
        {children}
      </div>

    </section>
  );
}
