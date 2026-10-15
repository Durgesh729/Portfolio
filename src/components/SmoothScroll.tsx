import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
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

        // Prevent browser from restoring scroll position on reload
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });

        // Keep ScrollTrigger updated with Lenis
        lenis.on('scroll', ScrollTrigger.update);

        // Synchronize Lenis with GSAP's ticker
        const updateTicker = (time: number) => {
            lenis.raf(time * 1000);
        };
        gsap.ticker.add(updateTicker);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(updateTicker);
            lenis.destroy();
            window.lenisInstance = undefined;
        };
    }, []);


    return <>{children}</>;
};

export default SmoothScroll;
