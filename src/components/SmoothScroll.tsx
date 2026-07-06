import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

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

        const raf = (time: number) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            window.lenisInstance = undefined;
        };
    }, []);

    return <>{children}</>;
};

export default SmoothScroll;
