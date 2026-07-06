"use client";

import { useEffect, useRef, useState, useMemo, createElement } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

interface TextTypeProps {
    text: string | string[];
    as?: keyof JSX.IntrinsicElements;
    typingSpeed?: number;
    initialDelay?: number;
    pauseDuration?: number;
    deletingSpeed?: number; // Kept for interface compatibility but force ignored in logic
    loop?: boolean; // Kept for interface compatibility but force ignored in logic
    className?: string;
    showCursor?: boolean;
    hideCursorWhileTyping?: boolean;
    cursorCharacter?: string;
    cursorClassName?: string;
    cursorBlinkDuration?: number;
    startOnVisible?: boolean;
    onSentenceComplete?: (sentence: string, index: number) => void;
    textColors?: string[]; // Kept for compatibility
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
    const [displayedText, setDisplayedText] = useState('');
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);

    const isWaiting = useRef(false);
    const cursorRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLElement>(null);

    const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

    // Intersection Observer
    useEffect(() => {
        if (!startOnVisible || !containerRef.current) return;

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnVisible]);

    // Cursor Animation
    useEffect(() => {
        if (showCursor && cursorRef.current) {
            gsap.set(cursorRef.current, { opacity: 1 });
            const anim = gsap.to(cursorRef.current, {
                opacity: 0,
                duration: cursorBlinkDuration,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut'
            });
            return () => {
                anim.kill();
            };
        }
    }, [showCursor, cursorBlinkDuration]);

    // Main Typing Logic
    useEffect(() => {
        if (!isVisible) return;
        if (isWaiting.current) return;

        // Check if we are done with all text
        if (currentTextIndex >= textArray.length) return;

        const currentString = textArray[currentTextIndex];
        let timeout: NodeJS.Timeout;

        // Safety check
        if (currentCharIndex >= currentString.length) {
            // Finished current string
            if (currentTextIndex < textArray.length - 1) {
                // Prepare for next string
                isWaiting.current = true;
                timeout = setTimeout(() => {
                    setDisplayedText(prev => prev + '\n\n');
                    setCurrentTextIndex(prev => prev + 1);
                    setCurrentCharIndex(0);
                    isWaiting.current = false;
                    // Optional: Trigger callback
                    if (onSentenceComplete) onSentenceComplete(currentString, currentTextIndex);
                }, pauseDuration);
            } else {
                // Finished everything
                if (onSentenceComplete) onSentenceComplete(currentString, currentTextIndex);
            }
            return () => clearTimeout(timeout);
        }

        // Typing character
        timeout = setTimeout(() => {
            setDisplayedText(prev => prev + currentString[currentCharIndex]);
            setCurrentCharIndex(prev => prev + 1);
        }, typingSpeed);

        return () => clearTimeout(timeout);

    }, [
        currentCharIndex,
        currentTextIndex,
        // isWaiting ref not needed in deps
        isVisible,
        textArray,
        typingSpeed,
        pauseDuration,
        onSentenceComplete,
        initialDelay // Note: Initial delay logic is simplified here as we start immediately if visible
    ]);

    // Handle Initial Delay specifically for the very first start
    useEffect(() => {
        if (isVisible && initialDelay > 0 && displayedText === '' && currentTextIndex === 0) {
            isWaiting.current = true;
            const timer = setTimeout(() => { isWaiting.current = false; }, initialDelay);
            return () => clearTimeout(timer);
        }
    }, [isVisible, initialDelay, displayedText, currentTextIndex]);


    const shouldHideCursor =
        hideCursorWhileTyping && !isWaiting.current && currentTextIndex < textArray.length;

    return createElement(
        Component,
        {
            ref: containerRef,
            className: `text-type ${className}`,
        },
        <span className="text-type__content">
            {displayedText}
        </span>,
        showCursor && (
            <span
                ref={cursorRef}
                className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
            >
                {cursorCharacter}
            </span>
        )
    );
};

export default TextType;
