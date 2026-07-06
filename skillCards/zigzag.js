/**
 * Zig-Zag Scroll Logic
 * 
 * Maps vertical scroll progress to horizontal movement across a pinned track of cards.
 * Applies a sinusoidal vertical offset to create a "zig-zag" effect.
 * 
 * Dependencies: GSAP, ScrollTrigger (active in window scope)
 */

export function initZigZagSkillRail({
    containerSelector = '#skills',
    railSelector = '.skills-rail',
    cardSelector = '.skill-card',
    amplitude = { desktop: 60, tablet: 30, mobile: 14 },
    snap = true
} = {}) {
    // Ensure GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded. Zig-Zag scroll skipped.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const container = document.querySelector(containerSelector);
    const rail = document.querySelector(railSelector);
    const cards = gsap.utils.toArray(cardSelector);

    if (!container || !rail || cards.length === 0) {
        console.warn('Zig-Zag elements not found:', { container, rail, cards });
        return;
    }

    // VALIDATION: Ensure Python is first and Docker is last
    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];
    const firstSkill = firstCard.dataset.skill?.toLowerCase();
    const lastSkill = lastCard.dataset.skill?.toLowerCase();

    if (firstSkill !== 'python' || lastSkill !== 'docker') {
        console.warn(`Skill order mismatch! Expected Python -> Docker. Found ${firstSkill} -> ${lastSkill}.`);
    }

    // Responsive Amplitude Logic
    const getYAmplitude = () => {
        const width = window.innerWidth;
        if (width <= 768) return amplitude.mobile;
        if (width <= 1024) return amplitude.tablet;
        return amplitude.desktop;
    };

    let yAmplitude = getYAmplitude();

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cleanup explicit resize listener if GSAP handles it, 
    // but explicitly updating our variable is safe.
    window.addEventListener('resize', () => {
        yAmplitude = getYAmplitude();
        ScrollTrigger.refresh();
    });

    // --- SCROLLTRIGGER SETUP ---

    const numberOfCards = cards.length;
    // Pin length: Allow enough vertical scroll to comfortably pan through all cards.
    // Using (N) * viewport height gives a 1:1 feel, or (N+1) for entrance/exit.
    const totalPinnedHeight = window.innerHeight * (numberOfCards);

    ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${totalPinnedHeight}`,
        pin: true,
        scrub: 1, // Smooth scrubbing
        anticipatePin: 1,
        snap: snap && !prefersReducedMotion ? {
            snapTo: 1 / (numberOfCards - 1), // Snap to each card index
            duration: { min: 0.2, max: 0.5 },
            ease: 'power2.inOut' // Smooth snap
        } : false,
        invalidateOnRefresh: true,
    });

    // --- ANIMATION TIMELINES ---

    // 1. Horizontal Rail Movement
    // Move the rail left so the last card aligns with the viewport center at the end.
    // We want the FIRST card centered at start (0% progress) and LAST card centered at end (100%).

    // A simple approach is translating the rail by -(N-1) * viewportWidth 
    // assuming each card takes up a viewport width effectively in terms of spacing.
    // Better approach: Calculate precise distance to shift.

    // However, your requirement asks for "Vertical scroll maps smoothly to horizontal progress".
    // Let's implement per-card logic for precise control and the zig-zag effect.

    cards.forEach((card, index) => {
        const isEven = index % 2 === 0;
        const altSign = isEven ? 1 : -1;

        // Initial State: Position cards? 
        // Actually, if they are flexed in a row, we just need to move the rail.
        // BUT to get the zig-zag effect relative to the scroll progress, we can animate the Y property of *each card* 
        // based on the global progress of the pinned container.

        // Let's control the RAIL for horizontal movement, and CARDS for vertical zig-zag.
    });

    // GSAP Tween for the Rail (Horizontal)
    // We'll move the rail so the cards slide by.
    // Distance = (ScrollWidth - ClientWidth) 
    // But we want to center items. 
    // Let's assume the rail is wide. 

    // To match the behavior "First visible Python, Last visible Docker":
    // At progress 0: Rail is at 0 (or centered on first card).
    // At progress 1: Rail is shifted so centered on last card.

    // We can use a simpler calculation: 
    // If cards are `100vw` apart (or centered in `100vw` sections), we shift by `-(N-1) * 100vw`.
    // Let's assume standard centering CSS is applied (padding-left/right).

    // We will animate the rail's xPercent.
    // If the rail has extensive padding to center the first element, we might need to adjust.
    // Let's assume the CSS handles layout (padding 50vw - cardWidth/2).
    // Then we just scroll to the end.

    const maxHorizontalScroll = -(rail.scrollWidth - window.innerWidth);

    // Main Timeline linked to the ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: `+=${totalPinnedHeight}`,
            scrub: 1,
        }
    });

    // Horizontal Motion
    tl.to(rail, {
        x: () => -(rail.scrollWidth - window.innerWidth), // Simple full traverse
        ease: 'none',
    });

    // Zig-Zag Motion
    // We want the cards to bob up and down based on the progress.
    // Since the scroll is continuous, we can drive the Y value of each card based on the timeline.

    if (!prefersReducedMotion) {
        // Single update loop for all cards
        tl.eventCallback("onUpdate", () => {
            cards.forEach((card, index) => {
                const isEven = index % 2 === 0;
                const altSign = isEven ? 1 : -1;

                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const centerScreen = window.innerWidth / 2;
                const distFromCenterPixels = centerScreen - cardCenter;
                const normalizedDist = distFromCenterPixels / (window.innerWidth / 2); // -1 to 1 roughly

                // Only apply if close to center (within 2 screen widths effectively)
                if (Math.abs(normalizedDist) < 2) {
                    // Sine wave for zero offset at center (resting position)
                    // y = altSign * Amp * sin(normalizedDist * PI)
                    const dynamicY = altSign * yAmplitude * Math.sin(normalizedDist * Math.PI);
                    gsap.set(card, { y: dynamicY });
                } else {
                    gsap.set(card, { y: 0 });
                }
            });
        });
    }
}
