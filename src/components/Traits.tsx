"use client";
import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import './Traits.css';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Trait {
    title: React.ReactNode;
    desc: string;
    lottieUrl?: string;
    imageUrl?: string;
    rawTitle?: string; // For key or comparison if needed, though index is fine here
}

const traitsData: Trait[] = [
    {
        title: "Problem Solver",
        desc: "Treating problems as technical challenges.",
        lottieUrl: "https://lottie.host/f32aea85-3f12-450a-a72f-0818248e14c0/KDxCaLNiBC.lottie"
    },
    {
        title: "Adaptive",
        desc: "Stay updated with rapidly changing tech.",
        lottieUrl: "https://lottie.host/e6dbdf70-1f06-449b-b09d-361bc5005baa/J5yGqwffqf.lottie"
    },
    {
        title: "Team Player",
        desc: "Contributing to shared codebases.",
        imageUrl: "/team-player.png"
    },
    {
        title: <>Innovation <br /> &nbsp;&nbsp;Focused</>,
        desc: "Seek knowledge and contribute ideas.",
        lottieUrl: "https://lottie.host/2d056247-245a-4112-bd09-943f739fc561/bwv5ow2iwG.lottie"
    },
    {
        title: "Time Management",
        desc: "Prioritize tasks and meet deadlines fast.",
        lottieUrl: "https://lottie.host/b9dc81f0-a827-4134-80bb-59108e542e38/i0fiaWBgNs.lottie"
    },
    {
        title: "Accountability",
        desc: "Own mistakes, accept blame, and offer solutions.",
        lottieUrl: "https://lottie.host/714ba4dc-22c1-46d6-ad6b-ff39c2f00b5a/UpuHsp1ST1.lottie"
    },
];

const TraitsCard: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%", // Animation starts when top of container hits 80% viewport height
                    end: "bottom 20%", // Reverses when bottom passes 20%
                    toggleActions: "play reverse play reverse",
                    // markers: true, // Uncomment for debugging
                }
            });

            tl.from(cardsRef.current, {
                x: -100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.inOut", // ease-in-out
                clearProps: "all" // Clean up styles after animation prevents conflict with hover effects if any
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="card-container" ref={containerRef}>
            {traitsData.map((trait, index) => (
                <div
                    key={index}
                    ref={(el) => { cardsRef.current[index] = el }}
                    className="card-item cursor-target"
                    data-desc={trait.desc}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {(trait.lottieUrl || trait.imageUrl) && hoveredIndex === index && (
                        <div style={{
                            position: 'absolute',
                            top: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '80px',
                            height: '80px',
                            zIndex: 10,
                            pointerEvents: 'none'
                        }}>
                            {trait.imageUrl ? (
                                <img
                                    src={trait.imageUrl}
                                    alt={typeof trait.title === 'string' ? trait.title : 'Trait icon'}
                                    width={80}
                                    height={80}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <DotLottieReact
                                    src={trait.lottieUrl}
                                    loop={true}
                                    autoplay={true}
                                />
                            )}
                        </div>
                    )}
                    <span className="title">{trait.title}</span>
                </div>
            ))}
        </div>
    );
};

export default TraitsCard;
