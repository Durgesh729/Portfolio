'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import './TargetCursor.css';

export interface TargetCursorProps {
  /** CSS selector targeting hoverable elements */
  targetSelector?: string;
  /** Idle rotation duration in seconds (default: 3) */
  spinDuration?: number;
  /** Duration of target snap animation (default: 0.2) */
  hoverDuration?: number;
  /** Enable subtle mouse parallax when targeting (default: true) */
  parallaxOn?: boolean;
  /** Default cursor color (default: '#ffffff') */
  cursorColor?: string;
  /** Accent color applied when hovering over targets (default: '#B497CF') */
  cursorColorOnTarget?: string;
}

const DEFAULT_TARGET_SELECTOR = [
  'a',
  'button',
  'input',
  'textarea',
  'select',
  '[role="button"]',
  '[role="tab"]',
  '[role="link"]',
  'label',
  // About section:
  '.feature-card--terminal',    // Programming main.py terminal card
  '.swipe',                     // Download Resume slider button
  '.card-item',                 // Problem solver, Adaptive, Team player, Innovation focus, Time management, Accountability
  '.tooltip-content',           // Workflow Design revealed tooltip cards ("Code Works", "Client Satisfied")
  '.tooltip-container',         // Workflow Design card container
  '.merge-btn',                 // Workflow Design button
  '.feature-card',              // Feature cards
  // Skills section:
  '.skill-card',
  '[data-skill]',
  // Projects section:
  '.project-card',
  '.project-tab',
  '.folder',
  '.live-btn',
  '.glass-card',
  '.glow-effect',
  // Education section:
  '.reveal-card',               // Learning Journey (B.E Computer Science, HSC)
  '.currently-learning-card',   // Currently Learning card
  '.card-learning-1',
  '.card-learning-2',
  '.card-learning-3',
  '.card',                      // Swap certificate cards
  // Contact section:
  '.profile-flip-card',         // Flippable profile card
  '.pc-card',                   // 3D tilt profile card
  '.pc-contact-btn',            // Contact Me button
  '.contact-send-btn',          // Send Message button
  '.contact-back-btn',          // Back button
  '.memories-btn-group',        // My memories group
  '.svg-name-con',              // Airplane icon button
  '.bounce-cards__card',        // Avatar bounce stack cards
  '.brutalist-container',       // Follow Me Social Links block
  '.social-cell',               // Each individual social link cell
  '.concrete-block',
  // General:
  '.cursor-target',
  '[data-cursor-target]',
  '.cursor-pointer'
].join(', ');

export const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = DEFAULT_TARGET_SELECTOR,
  spinDuration = 3,
  hoverDuration = 0.22,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget = '#B497CF'
}) => {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornersGroupRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<(HTMLDivElement | null)[]>([]);

  const spinTl = useRef<gsap.core.Tween | null>(null);
  const activeTargetRef = useRef<Element | null>(null);
  const isVisibleRef = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || ((window as unknown as { opera?: string }).opera || '');
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  useEffect(() => {
    if (!mounted || isMobile || !cursorRef.current || !cornersGroupRef.current) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const cornersGroup = cornersGroupRef.current;
    const corners = cornersRef.current.filter(Boolean) as HTMLDivElement[];

    const idleRadius = 14;
    const idleCornerSize = 8;
    const targetCornerSize = 10;
    const pad = 6;

    // Reset idle corner positions
    const setIdleCorners = (animated = false) => {
      const positions = [
        { x: -idleRadius, y: -idleRadius },
        { x: idleRadius - idleCornerSize, y: -idleRadius },
        { x: idleRadius - idleCornerSize, y: idleRadius - idleCornerSize },
        { x: -idleRadius, y: idleRadius - idleCornerSize }
      ];

      corners.forEach((corner, i) => {
        if (animated) {
          gsap.to(corner, {
            x: positions[i].x,
            y: positions[i].y,
            width: idleCornerSize,
            height: idleCornerSize,
            borderColor: cursorColor,
            duration: 0.22,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        } else {
          gsap.set(corner, {
            x: positions[i].x,
            y: positions[i].y,
            width: idleCornerSize,
            height: idleCornerSize,
            borderColor: cursorColor
          });
        }
      });

      if (dot) {
        if (animated) {
          gsap.to(dot, { backgroundColor: cursorColor, duration: 0.22 });
        } else {
          gsap.set(dot, { backgroundColor: cursorColor });
        }
      }
    };

    setIdleCorners(false);

    // Continuous idle rotation
    spinTl.current = gsap.to(cornersGroup, {
      rotation: 360,
      duration: spinDuration,
      repeat: -1,
      ease: 'none'
    });

    // Helper: Determine if mouse position is in EXCLUDED zones
    // (Enter Experience splash, laptop opening scene, Hero section, 3D memories book overlay)
    const isExcludedZone = (x: number, y: number): boolean => {
      // 0. Explicit check for 3D memories book overlay active
      if (
        document.body.classList.contains('memories-view-active') ||
        document.querySelector('.memories-slider--visible')
      ) {
        return true;
      }

      const el = document.elementFromPoint(x, y);
      if (!el) return true;

      // 1. Check if inside any explicitly excluded container
      if (
        el.closest(
          '[data-exclude-cursor="true"], .memories-overlay-root, .memories-slider, .memories-iframe, #home, .hero-section, #hero-scroll-wrapper, .laptop, .terminal-loader'
        )
      ) {
        return true;
      }

      // 2. Check if cursor is physically above the portfolio main content
      const portfolioContent = document.getElementById('portfolio-content');
      if (portfolioContent) {
        const portRect = portfolioContent.getBoundingClientRect();
        if (y < portRect.top - 10) {
          return true;
        }
      }

      return false;
    };

    // Smooth position updater using GSAP quickTo
    const setCursorX = gsap.quickTo(cursor, 'x', { duration: 0.06, ease: 'power2.out' });
    const setCursorY = gsap.quickTo(cursor, 'y', { duration: 0.06, ease: 'power2.out' });

    // Show/hide cursor wrapper & toggle body class
    const setCursorVisibility = (visible: boolean) => {
      if (isVisibleRef.current === visible) return;
      isVisibleRef.current = visible;

      if (visible) {
        cursor.style.opacity = '1';
        document.body.classList.add('target-cursor-hidden');
      } else {
        cursor.style.opacity = '0';
        document.body.classList.remove('target-cursor-hidden');
        if (activeTargetRef.current) {
          activeTargetRef.current = null;
          setIdleCorners(false);
          spinTl.current?.play();
        }
      }
    };

    // Tier 1: Specific interactive controls (buttons, links, folder, inputs, tabs)
    // These ALWAYS take priority over parent cards/containers
    const CONTROL_SELECTOR = [
      'button',
      'a',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '[role="tab"]',
      '[role="link"]',
      'label',
      '.cursor-target',
      '[data-cursor-target]',
      '.live-btn',
      '.project-tab',
      '.folder',
      '.folder-stage',
      '.project-folder',
      '.merge-btn',
      '.laptop-resume-btn',
      '.swipe',
      '.social-cell',
      '.pc-contact-btn',
      '.contact-send-btn',
      '.contact-back-btn',
      '.tooltip-content',
      '.feature-card--terminal',
      '.card-item',
      '.cursor-pointer'
    ].join(', ');

    // Tier 2: Card & section containers (when mouse is inside a card/container, but not on a control)
    const CARD_CONTAINER_SELECTOR = [
      '.project-card',
      '.glass-card',
      '.skill-card',
      '[data-skill]',
      '.feature-card',
      '.reveal-card',
      '.currently-learning-card',
      '.card-learning-1',
      '.card-learning-2',
      '.card-learning-3',
      '.card',
      '.profile-flip-card',
      '.pc-card',
      '.bounce-cards__card',
      '.brutalist-container',
      '.glow-effect'
    ].join(', ');

    /**
     * Resolve the best target for current mouse position.
     * Uses document.elementsFromPoint to respect paint order and z-index,
     * ensuring front-most stacked cards and nested child buttons are correctly targeted.
     */
    const resolveTarget = (mouseX: number, mouseY: number): Element | null => {
      if (typeof document === 'undefined') return null;

      const elements = document.elementsFromPoint(mouseX, mouseY);
      if (!elements || elements.length === 0) return null;

      // Tier 1: Check for interactive child controls under the pointer
      for (const el of elements) {
        if (el.closest?.('[data-exclude-cursor="true"], .memories-overlay-root, .memories-slider')) {
          return null;
        }

        const control = el.closest?.(CONTROL_SELECTOR);
        if (control) {
          if (control.closest('[data-exclude-cursor="true"]')) continue;
          // Prefer outer .folder element if inside folder component
          const folderEl = control.closest('.folder');
          if (folderEl) return folderEl;
          return control;
        }
      }

      // Tier 2: Check for card/container targets under pointer
      // Because elementsFromPoint is ordered topmost-first, when cards are stacked,
      // the front-most card in ScrollStack is returned!
      for (const el of elements) {
        if (el.closest?.('[data-exclude-cursor="true"], .memories-overlay-root, .memories-slider')) {
          return null;
        }

        const card = el.closest?.(CARD_CONTAINER_SELECTOR);
        if (card) {
          if (card.closest('[data-exclude-cursor="true"]')) continue;
          return card;
        }
      }

      // Tier 3: Fallback using user-provided targetSelector
      if (targetSelector) {
        for (const el of elements) {
          const match = el.closest?.(targetSelector);
          if (match && !match.closest('[data-exclude-cursor="true"]')) {
            return match;
          }
        }
      }

      return null;
    };

    // Check target lock-on
    const updateTargetLock = (mouseX: number, mouseY: number) => {
      if (!isVisibleRef.current) return;

      const target = resolveTarget(mouseX, mouseY);

      if (target && target !== activeTargetRef.current) {
        // ENTER NEW TARGET
        activeTargetRef.current = target;
        spinTl.current?.pause();
        gsap.to(cornersGroup, { rotation: 0, duration: 0.15, ease: 'power2.out' });

        const rect = target.getBoundingClientRect();
        const targetLeft = rect.left - pad - mouseX;
        const targetRight = rect.right + pad - mouseX;
        const targetTop = rect.top - pad - mouseY;
        const targetBottom = rect.bottom + pad - mouseY;

        const positions = [
          { x: targetLeft, y: targetTop },
          { x: targetRight - targetCornerSize, y: targetTop },
          { x: targetRight - targetCornerSize, y: targetBottom - targetCornerSize },
          { x: targetLeft, y: targetBottom - targetCornerSize }
        ];

        corners.forEach((corner, i) => {
          gsap.to(corner, {
            x: positions[i].x,
            y: positions[i].y,
            width: targetCornerSize,
            height: targetCornerSize,
            borderColor: cursorColorOnTarget,
            duration: hoverDuration,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        if (dot) {
          gsap.to(dot, { backgroundColor: cursorColorOnTarget, duration: hoverDuration });
        }
      } else if (!target && activeTargetRef.current) {
        // LEAVE TARGET -> RETURN TO IDLE
        activeTargetRef.current = null;
        setIdleCorners(true);
        spinTl.current?.play();
      }
    };

    // Live frame tracking for active target animations, transitions, and scrolling
    let rafId: number | null = null;
    let frameCount = 0;

    const trackActiveTargetFrame = () => {
      frameCount++;
      // Every 6 frames (~100ms), verify target lock is still matching the element under the cursor
      if (frameCount % 6 === 0 && lastMousePos.current.x >= 0 && lastMousePos.current.y >= 0) {
        const { x, y } = lastMousePos.current;
        if (!isExcludedZone(x, y)) {
          const currentBestTarget = resolveTarget(x, y);
          if (currentBestTarget !== activeTargetRef.current) {
            updateTargetLock(x, y);
          }
        }
      }

      if (activeTargetRef.current && isVisibleRef.current) {
        const target = activeTargetRef.current;
        if (target.isConnected) {
          const rect = target.getBoundingClientRect();
          const { x: mouseX, y: mouseY } = lastMousePos.current;
          const targetLeft = rect.left - pad - mouseX;
          const targetRight = rect.right + pad - mouseX;
          const targetTop = rect.top - pad - mouseY;
          const targetBottom = rect.bottom + pad - mouseY;

          let px = 0;
          let py = 0;
          if (parallaxOn) {
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            // Proportional and clamped parallax: subtle on small buttons, controlled on big cards
            const maxPx = Math.min(10, Math.max(2, rect.width * 0.02));
            const maxPy = Math.min(8, Math.max(2, rect.height * 0.02));
            px = Math.max(-maxPx, Math.min(maxPx, (mouseX - cx) * 0.025));
            py = Math.max(-maxPy, Math.min(maxPy, (mouseY - cy) * 0.025));
          }

          gsap.to(corners[0], { x: targetLeft + px, y: targetTop + py, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
          gsap.to(corners[1], { x: targetRight - targetCornerSize + px, y: targetTop + py, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
          gsap.to(corners[2], { x: targetRight - targetCornerSize + px, y: targetBottom - targetCornerSize + py, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
          gsap.to(corners[3], { x: targetLeft + px, y: targetBottom - targetCornerSize + py, duration: 0.1, ease: 'power2.out', overwrite: 'auto' });
        } else {
          activeTargetRef.current = null;
          setIdleCorners(true);
          spinTl.current?.play();
        }
      }
      rafId = requestAnimationFrame(trackActiveTargetFrame);
    };
    rafId = requestAnimationFrame(trackActiveTargetFrame);

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      lastMousePos.current = { x, y };

      if (isExcludedZone(x, y)) {
        setCursorVisibility(false);
        return;
      }

      setCursorVisibility(true);
      setCursorX(x);
      setCursorY(y);
      updateTargetLock(x, y);
    };

    const onScroll = () => {
      const { x, y } = lastMousePos.current;
      if (x < 0 || y < 0) return;

      if (isExcludedZone(x, y)) {
        setCursorVisibility(false);
        return;
      }

      setCursorVisibility(true);
      updateTargetLock(x, y);
    };

    const onMouseDown = () => {
      if (!isVisibleRef.current) return;
      if (dot) gsap.to(dot, { scale: 0.6, duration: 0.15 });
      gsap.to(cornersGroup, { scale: 0.9, duration: 0.15 });
    };

    const onMouseUp = () => {
      if (!isVisibleRef.current) return;
      if (dot) gsap.to(dot, { scale: 1, duration: 0.15 });
      gsap.to(cornersGroup, { scale: 1, duration: 0.15 });
    };

    // Instant observer: if memories view opens, hide target cursor immediately
    const bodyClassObserver = new MutationObserver(() => {
      if (document.body.classList.contains('memories-view-active')) {
        setCursorVisibility(false);
      }
    });
    bodyClassObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      bodyClassObserver.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);

      spinTl.current?.kill();
      document.body.classList.remove('target-cursor-hidden');
    };
  }, [
    mounted,
    isMobile,
    targetSelector,
    spinDuration,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget
  ]);

  if (!mounted || isMobile || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div ref={cursorRef} className="target-cursor-wrapper" aria-hidden="true">
      <div ref={dotRef} className="target-cursor-dot" />
      <div ref={cornersGroupRef} className="target-cursor-corners-group">
        <div ref={el => { cornersRef.current[0] = el; }} className="target-cursor-corner corner-tl" />
        <div ref={el => { cornersRef.current[1] = el; }} className="target-cursor-corner corner-tr" />
        <div ref={el => { cornersRef.current[2] = el; }} className="target-cursor-corner corner-br" />
        <div ref={el => { cornersRef.current[3] = el; }} className="target-cursor-corner corner-bl" />
      </div>
    </div>,
    document.body
  );
};

export default TargetCursor;
