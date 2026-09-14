"use client";
import { useEffect, useRef, useMemo, createElement } from 'react';
import { gsap } from 'gsap';
import './TextType.css';
import { useIdle } from '@/hooks/useIdle';

interface TextTypeProps {
    text: string | string[];
    as?: keyof JSX.IntrinsicElements;
    typingSpeed?: number;
    initialDelay?: number;
    pauseDuration?: number;
    deletingSpeed?: number;
    loop?: boolean;
    className?: string;
    showCursor?: boolean;
    hideCursorWhileTyping?: boolean;
    cursorCharacter?: string;
    cursorClassName?: string;
    cursorBlinkDuration?: number;
    startOnVisible?: boolean;
    onSentenceComplete?: (sentence: string, index: number) => void;
    textColors?: string[];
}

const TextType: React.FC<TextTypeProps> = ({
    text,
    as: Component = 'div',
    typingSpeed = 50,
    initialDelay = 0,
    pauseDuration = 2000,
    className = '',
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter = '|',
    cursorClassName = '',
    cursorBlinkDuration = 0.5,
    startOnVisible = false,
    onSentenceComplete,
}) => {
    const { isIdle } = useIdle();

    // ─── Refs ────────────────────────────────────────────────────────────────────
    // All animation-driving state lives in refs to avoid React re-renders on every
    // typed character. The only DOM update is a direct write to textNodeRef.
    const containerRef   = useRef<HTMLElement>(null);
    const contentRef     = useRef<HTMLSpanElement>(null);   // ← direct DOM write target
    const cursorRef      = useRef<HTMLElement>(null);
    const timeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Animation state — refs only, never React state
    const textArrayRef         = useRef<string[]>([]);
    const currentTextIndexRef  = useRef(0);
    const currentCharIndexRef  = useRef(0);
    const displayedTextRef     = useRef('');
    const isVisibleRef         = useRef(!startOnVisible);
    const isWaitingRef         = useRef(false);
    const isIdleRef            = useRef(false);
    const isUnmountedRef       = useRef(false);
    const cursorAnimRef        = useRef<gsap.core.Tween | null>(null);

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

    // Keep the ref in sync — no re-render needed when text prop changes
    textArrayRef.current = textArray;

    // ─── Keep isIdle ref in sync ──────────────────────────────────────────────────
    // useIdle only fires when idle state changes, so this is cheap.
    isIdleRef.current = isIdle;

    // ─── Core typing engine (runs entirely via setTimeout, zero React state) ──────
    const scheduleNext = () => {
        if (isUnmountedRef.current) return;
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const tick = () => {
            if (isUnmountedRef.current) return;
            if (isWaitingRef.current) return;
            if (!isVisibleRef.current) return;

            const arr = textArrayRef.current;
            const tIdx = currentTextIndexRef.current;

            if (tIdx >= arr.length) return; // all done

            const currentString = arr[tIdx];
            const cIdx = currentCharIndexRef.current;

            if (cIdx >= currentString.length) {
                // Finished typing this string
                if (tIdx < arr.length - 1) {
                    // Pause then move to the next string
                    isWaitingRef.current = true;
                    timeoutRef.current = setTimeout(() => {
                        if (isUnmountedRef.current) return;
                        displayedTextRef.current += '\n\n';
                        if (contentRef.current) {
                            contentRef.current.textContent = displayedTextRef.current;
                        }
                        currentTextIndexRef.current += 1;
                        currentCharIndexRef.current  = 0;
                        isWaitingRef.current         = false;
                        onSentenceComplete?.(currentString, tIdx);
                        scheduleNext();
                    }, pauseDuration);
                } else {
                    // All text done
                    onSentenceComplete?.(currentString, tIdx);
                    // Stop — no more scheduling
                    updateCursorPause();
                }
                return;
            }

            // Type the next character directly into the DOM — no React setState
            displayedTextRef.current += currentString[cIdx];
            if (contentRef.current) {
                contentRef.current.textContent = displayedTextRef.current;
            }
            currentCharIndexRef.current += 1;

            timeoutRef.current = setTimeout(tick, typingSpeed);
        };

        timeoutRef.current = setTimeout(tick, 0);
    };

    // ─── Cursor management (GSAP, direct DOM, no React state) ────────────────────
    const updateCursorPause = () => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const tIdx = currentTextIndexRef.current;
        const arr  = textArrayRef.current;
        const finished = tIdx >= arr.length ||
            (tIdx === arr.length - 1 && currentCharIndexRef.current >= arr[tIdx]?.length);
        const shouldPause = isIdleRef.current && finished;

        if (shouldPause) {
            cursorAnimRef.current?.kill();
            cursorAnimRef.current = null;
            gsap.set(cursor, { opacity: 1 });
        }
    };

    const startCursorBlink = () => {
        const cursor = cursorRef.current;
        if (!cursor || !showCursor || !isVisibleRef.current) return;

        cursorAnimRef.current?.kill();
        gsap.set(cursor, { opacity: 1 });
        cursorAnimRef.current = gsap.to(cursor, {
            opacity: 0,
            duration: cursorBlinkDuration,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut',
        });
    };

    const stopCursorBlink = () => {
        cursorAnimRef.current?.kill();
        cursorAnimRef.current = null;
    };

    // ─── Lifecycle ───────────────────────────────────────────────────────────────
    useEffect(() => {
        isUnmountedRef.current = false;

        // Reset animation state when text prop changes
        if (timeoutRef.current !== null) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
        currentTextIndexRef.current = 0;
        currentCharIndexRef.current = 0;
        displayedTextRef.current    = '';
        isWaitingRef.current        = false;
        if (contentRef.current) contentRef.current.textContent = '';

        if (!isVisibleRef.current) return; // wait for visibility

        const start = () => {
            if (initialDelay > 0) {
                isWaitingRef.current = true;
                timeoutRef.current = setTimeout(() => {
                    if (isUnmountedRef.current) return;
                    isWaitingRef.current = false;
                    scheduleNext();
                }, initialDelay);
            } else {
                scheduleNext();
            }
            startCursorBlink();
        };

        start();

        return () => {
            isUnmountedRef.current = true;
            if (timeoutRef.current !== null) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            stopCursorBlink();
        };
    // Only re-run when props that configure the animation change.
    // `scheduleNext` / `startCursorBlink` are stable closures defined in the component body.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, typingSpeed, pauseDuration, initialDelay, showCursor, cursorBlinkDuration]);

    // ─── Intersection Observer (only when startOnVisible=true) ──────────────────
    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isVisibleRef.current) {
                        isVisibleRef.current = true;
                        // Start the engine now that we are visible
                        scheduleNext();
                        startCursorBlink();
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startOnVisible]);

    // ─── Pause cursor when user goes idle and typing is finished ─────────────────
    useEffect(() => {
        updateCursorPause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isIdle]);

    // ─── JSX — static shell; text content is written directly to contentRef ──────
    return createElement(
        Component,
        {
            ref: containerRef,
            className: `text-type ${className}`,
        },
        <span ref={contentRef} className="text-type__content" />,
        showCursor && (
            <span
                ref={cursorRef}
                className={`text-type__cursor ${cursorClassName} ${hideCursorWhileTyping ? 'text-type__cursor--hidden' : ''}`}
            >
                {cursorCharacter}
            </span>
        )
    );
};

export default TextType;
