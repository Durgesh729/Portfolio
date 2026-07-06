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
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const animationRef = useRef<number>();

    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const card = cardRef.current;
        if (!card || !enableTilt) return;
        // ... previous tilt logic ...
        let targetTilt = { x: 0, y: 0 };
        let currentTilt = { x: 0, y: 0 };
        let rect: DOMRect | null = null;

        const handlePointerMove = (e: PointerEvent) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            targetTilt = { x: rotateX, y: rotateY };

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
            targetTilt = { x: 0, y: 0 };
            setIsHovering(false);
            if (glareRef.current) {
                glareRef.current.style.opacity = '0';
            }
        };

        const handlePointerEnter = () => {
            rect = card.getBoundingClientRect();
            setIsHovering(true);
        };

        const animate = () => {
            currentTilt.x += (targetTilt.x - currentTilt.x) * 0.1;
            currentTilt.y += (targetTilt.y - currentTilt.y) * 0.1;

            setTilt({ x: currentTilt.x, y: currentTilt.y });
            animationRef.current = requestAnimationFrame(animate);
        };

        card.addEventListener('pointermove', handlePointerMove);
        card.addEventListener('pointerleave', handlePointerLeave);
        card.addEventListener('pointerenter', handlePointerEnter);

        animate();

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
                style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: isHovering ? 'none' : 'transform 0.5s ease-out',
                }}
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
