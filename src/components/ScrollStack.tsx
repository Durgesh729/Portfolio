import { useLayoutEffect, useRef, useCallback, ReactNode, useEffect } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

interface ScrollStackItemProps {
    children: ReactNode;
    itemClassName?: string;
}

export const ScrollStackItem = ({ children, itemClassName = '' }: ScrollStackItemProps) => (
    <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
    children: ReactNode;
    className?: string;
    itemDistance?: number;
    itemScale?: number;
    itemStackDistance?: number;
    stackPosition?: string | number;
    scaleEndPosition?: string | number;
    baseScale?: number;
    scaleDuration?: number;
    rotationAmount?: number;
    blurAmount?: number;
    useWindowScroll?: boolean;
    onStackComplete?: () => void;
}

const ScrollStack = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    scaleDuration = 0.5,
    rotationAmount = 0,
    blurAmount = 0,
    useWindowScroll = false,
    onStackComplete
}: ScrollStackProps) => {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const stackCompletedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    const lenisRef = useRef<Lenis | null>(null);
    const cardsRef = useRef<HTMLElement[]>([]);
    const initialTopsRef = useRef<number[]>([]);
    const initialEndTopRef = useRef<number>(0);
    const lastTransformsRef = useRef(new Map());
    const isUpdatingRef = useRef(false);
    const isIntersectingRef = useRef(false);

    const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }, []);

    const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return typeof value === 'string' ? parseFloat(value) : value;
    }, []);

    const getScrollData = useCallback(() => {
        if (useWindowScroll) {
            return {
                scrollTop: window.scrollY,
                containerHeight: window.innerHeight,
                scrollContainer: document.documentElement
            };
        } else {
            const scroller = scrollerRef.current;
            if (!scroller) return { scrollTop: 0, containerHeight: 0, scrollContainer: null };
            return {
                scrollTop: scroller.scrollTop,
                containerHeight: scroller.clientHeight,
                scrollContainer: scroller
            };
        }
    }, [useWindowScroll]);

    const measureInitialTops = useCallback(() => {
        if (!cardsRef.current.length) return;

        // Temporarily clear any active transforms to read accurate static offsets
        const previousTransforms = cardsRef.current.map((card) => {
            const transform = card.style.transform;
            card.style.transform = '';
            return transform;
        });

        initialTopsRef.current = cardsRef.current.map((card) => {
            if (useWindowScroll) {
                const rect = card.getBoundingClientRect();
                return rect.top + window.scrollY;
            } else {
                return card.offsetTop;
            }
        });

        const endElement = scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement;
        if (endElement) {
            if (useWindowScroll) {
                initialEndTopRef.current = endElement.getBoundingClientRect().top + window.scrollY;
            } else {
                initialEndTopRef.current = endElement.offsetTop;
            }
        }

        // Restore transforms
        cardsRef.current.forEach((card, i) => {
            card.style.transform = previousTransforms[i];
        });
    }, [useWindowScroll, getScrollData]);

    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || isUpdatingRef.current) return;

        isUpdatingRef.current = true;

        if (initialTopsRef.current.length !== cardsRef.current.length) {
            measureInitialTops();
        }

        const { scrollTop, containerHeight } = getScrollData();
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        const endElementTop = initialEndTopRef.current;

        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const cardTop = initialTopsRef.current[i];
            if (cardTop === undefined) return;

            const pinEnd = endElementTop - containerHeight / 2;
            const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;

            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = baseScale + i * itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);
            const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

            let blur = 0;
            if (blurAmount) {
                let topCardIndex = 0;
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jCardTop = initialTopsRef.current[j];
                    if (jCardTop === undefined) continue;
                    const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
                    if (scrollTop >= jTriggerStart) {
                        topCardIndex = j;
                    }
                }

                if (i < topCardIndex) {
                    const depthInStack = topCardIndex - i;
                    blur = Math.max(0, depthInStack * blurAmount);
                }
            }

            let translateY = 0;
            const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
            }

            const newTransform = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                rotation: Math.round(rotation * 100) / 100,
                blur: Math.round(blur * 100) / 100
            };

            const lastTransform = lastTransformsRef.current.get(i);
            const hasChanged =
                !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
                Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
                Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

            if (hasChanged) {
                const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
                const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

                card.style.transform = transform;
                card.style.filter = filter;

                lastTransformsRef.current.set(i, newTransform);
            }

            if (i === cardsRef.current.length - 1) {
                const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
                if (isInView && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    if (onStackComplete) onStackComplete();
                } else if (!isInView && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        });

        isUpdatingRef.current = false;
    }, [
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        rotationAmount,
        blurAmount,
        onStackComplete,
        calculateProgress,
        parsePercentage,
        getScrollData,
        measureInitialTops
    ]);

    const handleScroll = useCallback(() => {
        if (!isIntersectingRef.current) return;
        updateCardTransforms();
    }, [updateCardTransforms]);

    const setupLenis = useCallback(() => {
        if (typeof window === 'undefined') return;

        if (useWindowScroll) {
            // Global Lenis is handling the smooth scroll; just listen to scroll events
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            const scroller = scrollerRef.current;
            if (!scroller || !(scroller.querySelector('.scroll-stack-inner') as HTMLElement)) return;

            const lenis = new Lenis({
                wrapper: scroller,
                content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 2,
                infinite: false,
                gestureOrientation: "vertical",
                wheelMultiplier: 1,
                lerp: 0.1,
                syncTouch: true,
                syncTouchLerp: 0.075,
            });

            lenis.on('scroll', handleScroll);

            const raf = (time: number) => {
                if (isIntersectingRef.current) {
                    lenis.raf(time);
                }
                animationFrameRef.current = requestAnimationFrame(raf);
            };
            animationFrameRef.current = requestAnimationFrame(raf);

            lenisRef.current = lenis;
            return lenis;
        }
    }, [handleScroll, useWindowScroll]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const cards = Array.from(
            scroller.querySelectorAll('.scroll-stack-card')
        ) as HTMLElement[];

        cardsRef.current = cards;
        const transformsCache = lastTransformsRef.current;

        cards.forEach((card, i) => {
            if (i < cards.length - 1) {
                card.style.marginBottom = `${itemDistance}px`;
            }
            card.style.willChange = 'transform, filter';
            card.style.transformOrigin = 'top center';
            card.style.backfaceVisibility = 'hidden';
            card.style.transform = 'translateZ(0)';
            card.style.webkitTransform = 'translateZ(0)';
            card.style.perspective = '1000px';
            card.style.webkitPerspective = '1000px';
        });

        const cleanupLenis = setupLenis();

        measureInitialTops();

        const handleLayoutChange = () => {
            measureInitialTops();
            updateCardTransforms();
        };

        window.addEventListener('resize', handleLayoutChange);
        window.addEventListener('load', handleLayoutChange);

        const delayTimer = setTimeout(handleLayoutChange, 200);

        updateCardTransforms();

        return () => {
            clearTimeout(delayTimer);
            window.removeEventListener('resize', handleLayoutChange);
            window.removeEventListener('load', handleLayoutChange);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            // If cleanupLenis is a function, call it (window scroll case)
            if (typeof cleanupLenis === 'function') {
                cleanupLenis();
            }
            // If lenisRef exists, destroy it (local scroll case)
            else if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            stackCompletedRef.current = false;
            cardsRef.current = [];
            transformsCache.clear();
            isUpdatingRef.current = false;
        };
    }, [
        itemDistance,
        itemScale,
        itemStackDistance,
        stackPosition,
        scaleEndPosition,
        baseScale,
        scaleDuration,
        rotationAmount,
        blurAmount,
        useWindowScroll,
        onStackComplete,
        setupLenis,
        updateCardTransforms,
        measureInitialTops
    ]);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersectingRef.current = entry.isIntersecting;
                if (entry.isIntersecting) {
                    updateCardTransforms();
                }
            },
            { threshold: 0 }
        );
        observer.observe(scroller);

        return () => {
            observer.disconnect();
        };
    }, [updateCardTransforms]);

    return (
        <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
            <div className="scroll-stack-inner">
                {children}
                {/* Spacer so the last pin can release cleanly */}
                <div className="scroll-stack-end" />
            </div>
        </div>
    );
};

export default ScrollStack;
