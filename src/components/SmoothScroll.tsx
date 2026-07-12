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
        window.lenisInstance = lenis; // ← expose for HeroSection

        let rafId: number | null = null;
        let scrollTriggerTimeout: number | null = null;
        let isScrollTriggerEnabled = true;

        const enableScrollTrigger = () => {
            if (!isScrollTriggerEnabled) {
                isScrollTriggerEnabled = true;
                ScrollTrigger.enable();
            }
            if (scrollTriggerTimeout !== null) {
                clearTimeout(scrollTriggerTimeout);
            }
            scrollTriggerTimeout = window.setTimeout(() => {
                if (isScrollTriggerEnabled) {
                    isScrollTriggerEnabled = false;
                    ScrollTrigger.disable(false, false);
                }
                scrollTriggerTimeout = null;
            }, 1500); // 1.5 seconds of inactivity before disabling
        };

        const startLoop = () => {
            if (rafId === null) {
                const loop = (time: number) => {
                    lenis.raf(time);
                    if (lenis.isScrolling === 'smooth') {
                        rafId = requestAnimationFrame(loop);
                    } else {
                        rafId = null;
                    }
                };
                rafId = requestAnimationFrame(loop);
            }
        };

        const onScrollAction = () => {
            startLoop();
            enableScrollTrigger();
        };

        // Bind events to trigger loop when scroll action starts
        lenis.on('virtual-scroll', onScrollAction);
        lenis.on('scroll', onScrollAction);

        window.addEventListener('wheel', onScrollAction, { passive: true });
        window.addEventListener('touchstart', onScrollAction, { passive: true });
        window.addEventListener('touchmove', onScrollAction, { passive: true });
        window.addEventListener('keydown', onScrollAction, { passive: true });
        window.addEventListener('resize', onScrollAction, { passive: true });

        // Trigger loop initially to align and settle starting state
        startLoop();

        // Defer initial suspension by 1.5 seconds on mount to let all components register their ScrollTriggers and finish layout setups
        scrollTriggerTimeout = window.setTimeout(() => {
            if (isScrollTriggerEnabled) {
                isScrollTriggerEnabled = false;
                ScrollTrigger.disable(false, false);
            }
            scrollTriggerTimeout = null;
        }, 1500);

        return () => {
            lenis.destroy();
            window.lenisInstance = undefined;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            if (scrollTriggerTimeout !== null) {
                clearTimeout(scrollTriggerTimeout);
            }
            // Re-enable ScrollTrigger on unmount to prevent page-wide lock
            if (!isScrollTriggerEnabled) {
                ScrollTrigger.enable();
            }
            window.removeEventListener('wheel', onScrollAction);
            window.removeEventListener('touchstart', onScrollAction);
            window.removeEventListener('touchmove', onScrollAction);
            window.removeEventListener('keydown', onScrollAction);
            window.removeEventListener('resize', onScrollAction);
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
