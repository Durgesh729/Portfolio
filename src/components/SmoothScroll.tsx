import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Expose Lenis globally so HeroSection can pause/resume it during animation
declare global {
  interface Window {
    lenisInstance?: Lenis;
  }
}

interface SmoothScrollProps {
    children: React.ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            autoRaf: false,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            touchInertiaMultiplier: 1.5,
        });

        lenisRef.current = lenis;
        window.lenisInstance = lenis;

        // ─── RAF loop ────────────────────────────────────────────────────────────
        // We keep a single RAF handle. The loop self-terminates when Lenis stops
        // scrolling, and is restarted by the scroll-start listeners below.
        // A running flag prevents double-starts from multiple concurrent events.
        let rafId: number | null = null;
        let loopRunning = false;

        const loop = (time: number) => {
            lenis.raf(time);
            // Keep running while Lenis is actively animating
            if (lenis.isScrolling === 'smooth') {
                rafId = requestAnimationFrame(loop);
            } else {
                rafId = null;
                loopRunning = false;
            }
        };

        const startLoop = () => {
            if (loopRunning) return;          // guard against duplicate starts
            loopRunning = true;
            rafId = requestAnimationFrame(loop);
        };

        // ─── ScrollTrigger enable/disable ────────────────────────────────────────
        // Previously ScrollTrigger was toggled on every single scroll event
        // (enable → schedule disable 1.5s later → cancel → enable again…).
        // This is expensive because ScrollTrigger.enable/disable forces a full
        // refresh of all triggers.
        //
        // Revised strategy: keep ScrollTrigger enabled at all times during scrolling,
        // and only disable it once the user has been truly idle for 2 seconds.
        // We use a single debounced timer — no enable/disable on every wheel event.
        let stDisableTimer: number | null = null;
        let stEnabled = true;

        const cancelDisableTimer = () => {
            if (stDisableTimer !== null) {
                clearTimeout(stDisableTimer);
                stDisableTimer = null;
            }
        };

        const scheduleDisable = () => {
            cancelDisableTimer();
            stDisableTimer = window.setTimeout(() => {
                if (stEnabled) {
                    stEnabled = false;
                    ScrollTrigger.disable(false, false);
                }
                stDisableTimer = null;
            }, 2000); // wait 2 s after last scroll before disabling
        };

        const ensureSTEnabled = () => {
            if (!stEnabled) {
                stEnabled = true;
                ScrollTrigger.enable();
            }
        };

        const onScrollAction = () => {
            startLoop();
            ensureSTEnabled();
            scheduleDisable();
        };

        // Lenis events — fire when scrolling starts
        lenis.on('virtual-scroll', onScrollAction);
        lenis.on('scroll', onScrollAction);

        // Native events that initiate a scroll gesture
        window.addEventListener('wheel',      onScrollAction, { passive: true });
        window.addEventListener('touchstart', onScrollAction, { passive: true });
        window.addEventListener('touchmove',  onScrollAction, { passive: true });
        window.addEventListener('keydown',    onScrollAction, { passive: true });
        window.addEventListener('resize',     onScrollAction, { passive: true });

        // Run once on mount to settle starting position
        startLoop();

        // Initial disable after page has settled (all ScrollTriggers registered)
        stDisableTimer = window.setTimeout(() => {
            if (stEnabled) {
                stEnabled = false;
                ScrollTrigger.disable(false, false);
            }
            stDisableTimer = null;
        }, 1500);

        return () => {
            lenis.destroy();
            window.lenisInstance = undefined;
            loopRunning = false;
            if (rafId !== null) { cancelAnimationFrame(rafId); }
            cancelDisableTimer();
            if (!stEnabled) { ScrollTrigger.enable(); }

            window.removeEventListener('wheel',      onScrollAction);
            window.removeEventListener('touchstart', onScrollAction);
            window.removeEventListener('touchmove',  onScrollAction);
            window.removeEventListener('keydown',    onScrollAction);
            window.removeEventListener('resize',     onScrollAction);
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
