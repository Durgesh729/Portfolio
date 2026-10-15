import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ZigZagOptions {
    containerSelector?: string;
    railSelector?: string;
    cardSelector?: string;
    amplitude?: {
        desktop: number;
        tablet: number;
        mobile: number;
    };
    snap?: boolean;
    enableKeyboardNav?: boolean;
}

export function initZigZagSkillRail({
    containerSelector = '#skills',
    railSelector = '.skills-rail',
    cardSelector = '.skill-card',
    amplitude = { desktop: 60, tablet: 30, mobile: 14 },
    snap = true
}: ZigZagOptions = {}) {
    const container = document.querySelector(containerSelector);
    const rail = document.querySelector(railSelector);
    const cards = gsap.utils.toArray(cardSelector) as HTMLElement[];

    if (!container || !rail || cards.length === 0) {
        console.warn('Zig-Zag elements not found:', { container, rail, cards });
        return () => { }; // Return no-op cleanup
    }

    // Responsive Amplitude Logic
    const getYAmplitude = () => {
        const width = window.innerWidth;
        if (width <= 768) return amplitude.mobile;
        if (width <= 1024) return amplitude.tablet;
        return amplitude.desktop;
    };

    let yAmplitude = getYAmplitude();

    // Cache card offsets (relative to rail start) + half width
    let cardOffsets: number[] = [];
    const cacheCardOffsets = () => {
        cardOffsets = cards.map(card => card.offsetLeft + card.offsetWidth / 2);
    };
    cacheCardOffsets();

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    // Cache xStart / xEnd so we don't re-read offsetLeft/offsetWidth on every
    // GSAP onUpdate tick (which was causing repeated forced layout reads).
    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];

    let cachedXStart = window.innerWidth / 2 - (firstCard.offsetLeft + firstCard.offsetWidth / 2);
    let cachedXEnd   = window.innerWidth / 2 - (lastCard.offsetLeft  + lastCard.offsetWidth  / 2);

    const handleResize = () => {
        yAmplitude = getYAmplitude();
        cacheCardOffsets();
        // Recompute cached positions on resize — the only correct time to read layout
        cachedXStart = window.innerWidth / 2 - (firstCard.offsetLeft + firstCard.offsetWidth / 2);
        cachedXEnd   = window.innerWidth / 2 - (lastCard.offsetLeft  + lastCard.offsetWidth  / 2);
        ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // --- SCROLLTRIGGER & TIMELINE SETUP ---
    const numberOfCards = cards.length;
    // Pin length: Allow enough vertical scroll to comfortably pan through all cards.
    const totalPinnedHeight = window.innerHeight * numberOfCards;

    const snapConfig = snap && !prefersReducedMotion ? {
        snapTo: 1 / (numberOfCards - 1),
        duration: { min: 0.2, max: 0.5 },
        ease: 'power2.inOut'
    } : undefined;

    // Set initial position of the rail so Python card starts in the middle
    gsap.set(rail, { x: cachedXStart });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: `+=${totalPinnedHeight}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            snap: snapConfig,
            invalidateOnRefresh: true,
            onRefresh: () => {
                // Sync cached positions whenever GSAP refreshes layout
                cachedXStart = window.innerWidth / 2 - (firstCard.offsetLeft + firstCard.offsetWidth / 2);
                cachedXEnd   = window.innerWidth / 2 - (lastCard.offsetLeft  + lastCard.offsetWidth  / 2);
            }
        }
    });

    // Horizontal Motion: Move rail from xStart (Python card centered) to xEnd (Docker card centered)
    tl.fromTo(rail,
        { x: () => cachedXStart },
        {
            x: () => cachedXEnd,
            ease: 'none',
        }
    );

    // Zig-Zag Motion
    if (!prefersReducedMotion) {
        // High-performance GSAP quickSetter for Y position to bypass parsing overhead
        const ySetters = cards.map(card => gsap.quickSetter(card, "y", "px"));

        // Single update loop for all cards — uses only cached values, no layout reads
        tl.eventCallback("onUpdate", () => {
            const p = tl.progress();
            // Use pre-cached positions — avoids DOM layout reads on every scrub frame
            const railX = cachedXStart + (cachedXEnd - cachedXStart) * p;
            const centerScreen = window.innerWidth / 2;

            cards.forEach((card, index) => {
                const isEven = index % 2 === 0;
                const altSign = isEven ? 1 : -1;

                const cardCenter = railX + cardOffsets[index];
                const distFromCenterPixels = centerScreen - cardCenter;

                // Normalize distance: -1 at left edge, +1 at right edge (roughly)
                const normalizedDist = distFromCenterPixels / (window.innerWidth / 2);

                // Only apply if close to center (within 2 screen widths effectively)
                if (Math.abs(normalizedDist) < 2) {
                    // Sine wave for zero offset at center (resting position)
                    const dynamicY = altSign * yAmplitude * Math.sin(normalizedDist * Math.PI);
                    ySetters[index](dynamicY);
                } else {
                    ySetters[index](0);
                }
            });
        });
    }

    // Return Cleanup Function
    return () => {
        window.removeEventListener('resize', handleResize);
        tl.scrollTrigger?.kill();
        tl.kill();
        // Reset transforms
        gsap.set(rail, { clearProps: 'all' });
        gsap.set(cards, { clearProps: 'all' });
    };
}

