import { useEffect, useRef, useState } from 'react';
import './ProfileCard.css';

interface ProfileCardProps {
    name: string;
    title: string;
    handle: string;
    status: string;
    contactText: string;
    avatarUrl: string;
    enableTilt?: boolean;
    onContactClick?: () => void;
}

export default function ProfileCard({
    name,
    title,
    handle,
    status,
    contactText,
    avatarUrl,
    enableTilt = true,
    onContactClick,
}: ProfileCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);
    // Use a ref instead of state so tilt updates bypass React's render cycle entirely.
    // The transform is applied directly to the DOM element in the RAF loop.
    const animationRef = useRef<number>();

    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card || !enableTilt) return;

        let targetTilt = { x: 0, y: 0 };
        let currentTilt = { x: 0, y: 0 };
        let rect: DOMRect | null = null;
        let animating = false;
        // Track hover state in a ref — no state needed here either
        let hovering = false;

        const applyTransform = (x: number, y: number, transition: string) => {
            card.style.transition = transition;
            card.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`;
        };

        const animate = () => {
            const dx = targetTilt.x - currentTilt.x;
            const dy = targetTilt.y - currentTilt.y;

            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                currentTilt = {
                    x: currentTilt.x + dx * 0.1,
                    y: currentTilt.y + dy * 0.1
                };
                // Write directly to DOM — no React setState, no re-render
                applyTransform(currentTilt.x, currentTilt.y, 'none');
                animationRef.current = requestAnimationFrame(animate);
            } else {
                currentTilt = { x: targetTilt.x, y: targetTilt.y };
                applyTransform(currentTilt.x, currentTilt.y, hovering ? 'none' : 'transform 0.5s ease-out');
                animating = false;
                animationRef.current = undefined;
            }
        };

        const startAnimating = () => {
            if (!animating) {
                animating = true;
                animationRef.current = requestAnimationFrame(animate);
            }
        };

        const handlePointerMove = (e: PointerEvent) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            targetTilt = {
                x: ((y - centerY) / centerY) * -15,
                y: ((x - centerX) / centerX) * 15
            };
            startAnimating();

            if (glowRef.current) {
                const glowX = (x / rect.width) * 100;
                const glowY = (y / rect.height) * 100;
                glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.3), transparent 50%)`;
            }

            if (glareRef.current) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4), transparent 50%)`;
                glareRef.current.style.opacity = '1';
            }
        };

        const handlePointerLeave = () => {
            rect = null;
            hovering = false;
            targetTilt = { x: 0, y: 0 };
            if (glareRef.current) {
                glareRef.current.style.opacity = '0';
            }
            startAnimating();
        };

        const handlePointerEnter = () => {
            rect = card.getBoundingClientRect();
            hovering = true;
            startAnimating();
        };

        card.addEventListener('pointermove', handlePointerMove);
        card.addEventListener('pointerleave', handlePointerLeave);
        card.addEventListener('pointerenter', handlePointerEnter);

        return () => {
            card.removeEventListener('pointermove', handlePointerMove);
            card.removeEventListener('pointerleave', handlePointerLeave);
            card.removeEventListener('pointerenter', handlePointerEnter);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [enableTilt]);

    const handleContact = () => {
        if (onContactClick) {
            onContactClick();
        }
    };

    return (
        <div className="pc-container">
            <div
                ref={cardRef}
                className="pc-card"
                // Static baseline — actual tilt is applied via DOM ref in the RAF loop
                style={{ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' }}
            >
                <div className="pc-image-section">
                    {!imageError ? (
                        <img
                            src={avatarUrl}
                            alt={name}
                            className="pc-avatar-image"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-6xl font-bold text-white/50">
                            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                    )}
                    <div ref={glowRef} className="pc-glow" />
                    <div ref={glareRef} className="pc-glare" />
                    <div className="pc-image-mask" />

                    <div className="pc-header-overlay">
                        <h2 className="pc-name">{name}</h2>
                        <p className="pc-title">{title}</p>
                    </div>
                </div>

                <div className="pc-footer">
                    <div className="pc-info">
                        <span className="pc-handle">{handle}</span>
                        <span className="pc-status">
                            <span className="pc-status-dot" />
                            {status}
                        </span>
                    </div>
                    <button onClick={handleContact} className="pc-contact-btn">
                        {contactText}
                    </button>
                </div>
            </div>
        </div>
    );
}
