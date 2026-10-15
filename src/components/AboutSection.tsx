import React, { useRef, useLayoutEffect } from 'react';
import TraitsCard from "./Traits";
import "./AboutSection.css";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("standard", "0.4, 0.0, 0.2, 1");
if (import.meta.env.DEV && typeof window !== "undefined") {
  (window as unknown as { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }).gsap = gsap;
  (window as unknown as { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
}


const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const laptopLidRef = useRef<HTMLDivElement>(null);
  const laptopBaseRef = useRef<HTMLDivElement>(null);
  const laptopShadowRef = useRef<HTMLDivElement>(null);
  const laptopScreenRef = useRef<HTMLDivElement>(null);

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Durgesh_Padwal_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.from(leftColRef.current, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          x: -40,
          opacity: 0,
          duration: 0.8,
          ease: "standard",
          clearProps: "all"
        });
      }

      if (bioRef.current) {
        const tlBio = gsap.timeline({
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play reverse play reverse",
          }
        });

        tlBio.from(bioRef.current, {
          x: -100,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          clearProps: "all"
        });
      }

      // ─── Scroll-Driven 3D Laptop Animation (Hero -> About Me -> Skills) ───
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      if (!prefersReducedMotion && laptopLidRef.current && sectionRef.current) {
        // Initial state at top of page: fully closed against keyboard/base
        gsap.set(laptopLidRef.current, {
          rotateX: -88.5,
          transformOrigin: "50% 100% 0",
        });

        if (laptopBaseRef.current) {
          gsap.set(laptopBaseRef.current, {
            y: 46,
            scaleX: 1.42,
            transformOrigin: "50% 50% 0",
          });
        }

        if (laptopShadowRef.current) {
          gsap.set(laptopShadowRef.current, {
            y: 46,
            scaleX: 1.35,
            opacity: 0.95,
          });
        }

        const laptopTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".about-laptop-container",
            start: "top 95%",        // Begins opening smoothly as Hero scrolls out and laptop enters view
            end: "bottom 20%",       // Completes 100% closed as About Me transitions into Skills
            scrub: true,             // 100% scroll-scrubbed, reversible parallax 3D animation
            invalidateOnRefresh: true,
          },
        });

        // ── Phase 1 (Transition A: Hero -> About Me): Open progressively around hinge (-88.5° -> 0°) ──
        laptopTl.fromTo(
          laptopLidRef.current,
          { rotateX: -88.5 },
          {
            rotateX: 0,
            duration: 2.8,
            ease: "power1.inOut",
          },
          0
        );

        if (laptopBaseRef.current) {
          laptopTl.fromTo(
            laptopBaseRef.current,
            { y: 46, scaleX: 1.42 },
            { y: 0, scaleX: 1.0, duration: 2.8, ease: "power1.inOut" },
            0
          );
        }

        if (laptopShadowRef.current) {
          laptopTl.fromTo(
            laptopShadowRef.current,
            { y: 46, scaleX: 1.35, opacity: 0.95 },
            { y: 0, scaleX: 1.0, opacity: 0.75, duration: 2.8, ease: "power1.inOut" },
            0
          );
        }

        // ── Phase 2 (In About Me): Fully open endpoint (100% open, natural viewing angle) ──
        // Held 100% open throughout the entire About Me reading & interaction stage
        laptopTl.to(
          laptopLidRef.current,
          { rotateX: 0, duration: 4.2 },
          2.8
        );

        if (laptopBaseRef.current) {
          laptopTl.to(
            laptopBaseRef.current,
            { y: 0, scaleX: 1.0, duration: 4.2 },
            2.8
          );
        }

        if (laptopShadowRef.current) {
          laptopTl.to(
            laptopShadowRef.current,
            { y: 0, scaleX: 1.0, opacity: 0.75, duration: 4.2 },
            2.8
          );
        }

        // ── Phase 3 (Transition B: Leaving About Me toward Skills): Progressively close downward toward base (0° -> -88.5°) ──
        // Closes while going from About Me to Skills; base panel tracks beneath the lid so it remains clearly visible
        laptopTl.to(
          laptopLidRef.current,
          {
            rotateX: -88.5,
            duration: 3.0,
            ease: "power1.inOut",
          },
          7.0
        );

        if (laptopBaseRef.current) {
          laptopTl.to(
            laptopBaseRef.current,
            { y: 46, scaleX: 1.42, duration: 3.0, ease: "power1.inOut" },
            7.0
          );
        }

        if (laptopShadowRef.current) {
          laptopTl.to(
            laptopShadowRef.current,
            { y: 46, scaleX: 1.35, opacity: 0.95, duration: 3.0, ease: "power1.inOut" },
            7.0
          );
        }
      }

      // Schedule ScrollTrigger refreshes to guarantee accurate layout metrics
      ScrollTrigger.refresh();
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => clearTimeout(refreshTimer);
    }, sectionRef);


    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative about-section pt-24 pb-20">
      {/* Curved bending arch transition rising up into Hero section */}
      <div className="absolute top-[-149px] left-0 w-full h-[150px] z-30 pointer-events-none leading-[0]">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="block w-full h-full">
          <path d="M0 150 C 360 0 1080 0 1440 150 Z" fill="#050816"></path>
        </svg>
      </div>

      <div className="about-main-wrapper relative z-10">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-card/20 to-background pointer-events-none" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[600px]">
            {/* Left Column - Headline, Bio, Traits */}
            <div ref={leftColRef} className="lg:col-span-7 space-y-6">
              {/* Greeting loader and Durgesh Padwal grouped with tight spacing */}
              <div className="flex flex-col -space-y-1">
                <div className="hello-wrapper-about inline-flex items-center">
                  <div className="loader-about">
                    <div className="words-about">
                      <span className="word-about"></span>
                      <span className="word-about">नमस्ते मी</span>
                      <span className="word-about">வணக்கம் நான்</span>
                      <span className="word-about">Hello I'm</span>
                      <span className="word-about">ہیلو میں ہوں</span>
                    </div>
                  </div>
                </div>

                <div className="about-cursive-name text-2xl sm:text-3xl lg:text-4xl text-[#e2e8f0] font-normal tracking-wide">
                  Durgesh Padwal
                </div>
              </div>

              {/* Main Headline */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] font-extrabold tracking-tight leading-[1.08] text-white">
                My Curiosity<br />
                Do Builds <span className="text-[#464bc4]">Better Solutions.</span>
              </h2>

              {/* Bio Paragraphs with Cyan Left Rule */}
              <div ref={bioRef} className="border-l-[3px] border-[#00f2ff] pl-5 space-y-4 py-1 text-[#cbd5e1] font-normal leading-relaxed text-[15px] sm:text-[16px] max-w-xl">
                <p>
                  I'm a Computer Science Engineering student specializing in Artificial Intelligence and Machine Learning. My curiosity drives me to explore the boundaries of what's possible with technology.
                </p>
                <p>
                  As a dedicated problem-solver and continuous learner, I'm focused on building intelligent and impactful solutions that can make a real difference in people's lives.
                </p>
              </div>

              {/* Traits Card - Untouched */}
              <div className="pt-2 flex justify-start">
                <TraitsCard />
              </div>
            </div>

            {/* Right Column - Laptop Mockup with Interactive Swipe Resume Button inside */}
            <div ref={rightColRef} className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="about-laptop-container">
                <div className="about-laptop">
                  {/* 3D Laptop Lid Assembly with Bottom Hinge Pivot */}
                  <div ref={laptopLidRef} className="about-laptop-lid">
                    {/* Back Cover (Facing upward when closed) */}
                    <div className="about-laptop-lid-back">
                      <div className="about-laptop-back-badge">
                        <span className="about-laptop-back-logo">DP</span>
                      </div>
                      <div className="about-laptop-back-sheen" />
                    </div>

                    {/* Front Display Assembly (Visible when open) */}
                    <div ref={laptopScreenRef} className="about-laptop-lid-front">
                      <div className="about-laptop-bezel">
                        {/* Webcam */}
                        <div className="about-laptop-camera" />

                        {/* Screen Display */}
                        <div className="about-laptop-screen">
                          {/* Interactive Swipe Resume Button inside Laptop Screen */}
                          <div className="conti pointer-events-none" style={{ transform: "scale(0.85)" }}>
                            <input type="checkbox" id="unlock-toggle" hidden />
                            <label className="swipe cursor-target pointer-events-auto" htmlFor="unlock-toggle" onClick={handleResumeDownload}>
                              <div className="glow pointer-events-none"></div>
                              <div className="knob pointer-events-none">
                                <svg className="lock" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="6" y="11" width="12" height="10" rx="2" ry="2" fill="#00000000" stroke="#7a929d86" strokeWidth="1.6"></rect>
                                  <path d="M8.5 11V8.5A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 3.5 3.5V11" fill="none" stroke="#7a929d86" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                <svg className="lock-glow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="6" y="11" width="12" height="10" rx="2" ry="2" fill="#00000000" stroke="#7a929d" strokeWidth="1.6"></rect>
                                  <path d="M8.5 11V8.5A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 3.5 3.5V11" fill="none" stroke="#7a929d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                              </div>
                              <div className="label-alt pointer-events-none">
                                <span>P</span><span>r</span><span>e</span><span>s</span><span>s</span>
                                <span>&nbsp;</span>
                                <span>a</span><span>n</span><span>d</span>
                                <span>&nbsp;</span>
                                <span>h</span><span>o</span><span>l</span><span>d</span>
                                <span>&nbsp;</span>
                                <span>t</span><span>o</span>
                                <span>&nbsp;</span>
                                <span>D</span><span>o</span><span>w</span><span>n</span><span>l</span><span>o</span><span>a</span><span>d</span>
                              </div>
                              <div className="label pointer-events-none">
                                <span>D</span><span>o</span><span>w</span><span>n</span><span>l</span><span>o</span><span>a</span><span>d</span>
                                <span>&nbsp;</span>
                                <span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span>
                              </div>
                            </label>

                            <svg className="ripple pointer-events-none" version="1.1" xmlns="http://www.w3.org/2000/svg" width="329" height="69" viewBox="0,0,329,69">
                              <g transform="translate(166.34519,34.05402)">
                                <g fill="none" stroke="#aaaaaa22" strokeWidth="3" strokeMiterlimit="10">
                                  <path d="M-164.84519,-4.27474c0,-16.1705 12.23994,-28.27928 28.41044,-28.27928c0.62712,0 269.76321,0.01971 270.38053,0.05856c14.48923,0.91174 26.11884,12.36192 27.31149,26.7732c0.06679,0.807 -0.23249,12.13079 -0.23249,12.95503c0,16.1705 -12.08038,26.27928 -28.25088,26.27928c-0.53766,0 -269.75928,-0.01449 -270.2898,-0.0431c-13.76896,-0.74265 -25.0656,-12.1284 -27.26126,-25.61178c-0.26413,-1.62197 -0.06804,-10.45329 -0.06804,-12.1319z"></path>
                                </g>
                              </g>
                            </svg>

                            <svg className="particles pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,25,28">
                              <g transform="translate(23.16486,16.9609)">
                                <g strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10">
                                  <path d="M-8.60292,-15.4609l9.72436,11.28025"></path>
                                  <path d="M-17.88391,-3.73728l14.00307,5.05667"></path>
                                  <path d="M-21.66486,9.43345h14.39205"></path>
                                </g>
                              </g>
                            </svg>

                            <svg className="clank pointer-events-none" version="1.1" xmlns="http://www.w3.org/2000/svg" width="39" height="64" viewBox="0,0,39,64">
                              <g transform="translate(2.70145,41.30984)">
                                <g fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10">
                                  <path d="M0.31997,-7.0285l16.51652,-31.53153l16.51652,21.02102z"></path>
                                  <path d="M4.82448,1.98051l22.52252,1.5015l-9.00901,16.51652z"></path>
                                </g>
                              </g>
                            </svg>

                            <div className="key pointer-events-none">
                              <svg width="128" height="128" viewBox="0 0 20 20">
                                <path fill="transparent" stroke="#777f82" strokeWidth="0.5" d="M 14 1 C 10.692214 1 8 3.6922138 8 7 C 8.0009187 7.6566689 8.1675322 8.2941025 8.3789062 8.9140625 L 0.14648438 17.146484 A 0.50005 0.50005 0 0 0 0 17.5 L 0 19.5 A 0.50005 0.50005 0 0 0 0.5 20 L 3.5 20 A 0.50005 0.50005 0 0 0 3.8535156 19.853516 L 4.7070312 19 L 6.5 19 A 0.50005 0.50005 0 0 0 7 18.5 L 7 17 L 8.5 17 A 0.50005 0.50005 0 0 0 9 16.5 L 9 14.707031 L 11.408203 12.298828 C 12.222493 12.696518 13.08808 12.998007 13.998047 13 A 0.50005 0.50005 0 0 0 14 13 C 17.307786 13 20 10.307786 20 7 C 20 3.6922138 17.307786 1 14 1 z M 14 2 C 16.767346 2 19 4.2326539 19 7 C 19 9.7666799 16.768376 11.998925 14.001953 12 C 13.122276 11.9981 12.258393 11.764657 11.498047 11.322266 A 0.50005 0.50005 0 0 0 10.892578 11.400391 L 8.1464844 14.146484 A 0.50005 0.50005 0 0 0 8 14.5 L 8 16 L 6.5 16 A 0.50005 0.50005 0 0 0 6 16.5 L 6 18 L 4.5 18 A 0.50005 0.50005 0 0 0 4.1464844 18.146484 L 3.2929688 19 L 1 19 L 1 17.707031 L 9.2675781 9.4394531 A 0.50005 0.50005 0 0 0 9.3769531 8.8964844 C 9.1293039 8.2948851 9.0009101 7.6505774 9 7 C 9 4.2326539 11.232654 2 14 2 z M 15 3 C 13.901353 3 13 3.9013528 13 5 C 13 6.0986472 15 7 C 16.098647 7 17 6.0986472 17 5 C 17 3.9013528 16.098647 3 15 3 z M 15 4 C 15.558207 4 16 4.4417929 16 5 C 16 5.5582071 15.558207 6 15 6 C 14.441793 6 14 5.5582071 14 5 C 14 4.4417929 14.441793 4 15 4 z"></path>
                              </svg>
                              <svg className="mouse" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 32 32">
                                <g>
                                  <path fill="#FFFFFF" d="M12.6,13c0.5-0.2,1.4-0.1,1.7,0.5c0.2,0.5,0.4,1.2,0.4,1.1c0-0.4,0-1.2,0.1-1.6 c0.1-0.3,0.3-0.6,0.7-0.7c0.3-0.1,0.6-0.1,0.9-0.1c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.3,0.1-1.2,0.3-1.6 c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7 c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8 c-0.1,0.6-0.1,0.6-0.1,1c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0 c-0.2,0.4-0.7,1.1-1,1.1c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1l-0.8-0.9c-0.3-0.4-1-0.9-1.2-2 c-0.2-0.9-0.2-1.4,0-1.8c0.2-0.4,0.7-0.6,0.9-0.6c0.2,0,0.7,0,0.9,0.1c0.2,0.1,0.3,0.2,0.5,0.4c0.2,0.3,0.3,0.5,0.2,0.1 c-0.1-0.3-0.3-0.6-0.4-1c-0.1-0.4-0.4-0.9-0.4-1.5C11.7,13.9,11.8,13.3,12.6,13"></path>
                                  <path fill="none" stroke="#000000" strokeWidth="0.75" strokeLinejoin="round" d="M12.6,13 c0.5-0.2,1.4-0.1,1.7,0.5c0.2,0.5,0.4,1.2,0.4,1.1c0-0.4,0-1.2,0.1-1.6c0.1-0.3,0.3-0.6,0.7-0.7c0.3-0.1,0.6-0.1,0.9-0.1 c0.3,0.1,0.6,0.3,0.8,0.5c0.4,0.6,0.4,1.9,0.4,1.8c0.1-0.3,0.1-1.2,0.3-1.6c0.1-0.2,0.5-0.4,0.7-0.5c0.3-0.1,0.7-0.1,1,0 c0.2,0,0.6,0.3,0.7,0.5c0.2,0.3,0.3,1.3,0.4,1.7c0,0.1,0.1-0.4,0.3-0.7c0.4-0.6,1.8-0.8,1.9,0.6c0,0.7,0,0.6,0,1.1 c0,0.5,0,0.8,0,1.2c0,0.4-0.1,1.3-0.2,1.7c-0.1,0.3-0.4,1-0.7,1.4c0,0-1.1,1.2-1.2,1.8c-0.1,0.6-0.1,0.6-0.1,1 c0,0.4,0.1,0.9,0.1,0.9s-0.8,0.1-1.2,0c-0.4-0.1-0.9-0.8-1-1.1c-0.2-0.3-0.5-0.3-0.7,0c-0.2,0.4-0.7,1.1-1,1.1 c-0.7,0.1-2.1,0-3.1,0c0,0,0.2-1-0.2-1.4c-0.3-0.3-0.8-0.8-1.1-1.1l-0.8-0.9c-0.3-0.4-1-0.9-1.2-2c-0.2-0.9-0.2-1.4,0-1.8 c0.2-0.4,0.7-0.6,0.9-0.6c0.2,0,0.7,0,0.9,0.1c0.2,0.1,0.3,0.2,0.5,0.4c0.2,0.3,0.3,0.5,0.2,0.1c-0.1-0.3-0.3-0.6-0.4-1 c-0.1-0.4-0.4-0.9-0.4-1.5C11.7,13.9,11.8,13.3,12.6,13z"></path>
                                  <line fill="none" stroke="#000000" strokeWidth="0.75" strokeLinecap="round" x1="19.6" y1="20.7" x2="19.6" y2="17.3"></line>
                                  <line fill="none" stroke="#000000" strokeWidth="0.75" strokeLinecap="round" x1="17.6" y1="20.7" x2="17.5" y2="17.3"></line>
                                  <line fill="none" stroke="#000000" strokeWidth="0.75" strokeLinecap="round" x1="15.6" y1="17.3" x2="15.6" y2="20.7"></line>
                                </g>
                              </svg>
                            </div>

                            <svg className="big-lock pointer-events-none" viewBox="0 0 120 120">
                              <path fill="none" stroke="#c7cfd2" strokeWidth="0.5" d="M23,14l0-4.706c0-3.833-2.953-7.175-6.785-7.29C12.251,1.884,9,5.062,9,9v5H8c-1.657,0-3,1.343-3,3v10, c0,1.657,1.343,3,3,3h16c1.657,0,3-1.343,3-3V17c0-1.657-1.343-3-3-3H23z M10,9c0-3.308,2.692-6,6-6s6,2.692,6,6v5h-1V9 c0-2.757-2.243-5-5-5s-5,2.243-5,5v5h-1V9z M20,14h-8V9c0-2.209,1.791-4,4-4s4,1.791,4,4V14z M24,29H8c-1.105,0-2-0.895-2-2V17 c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v10C26,28.105,25.105,29,24,29z M18,20c0-1.105-0.895-2-2-2s-2,0.895-2,2 c0,0.685,0.345,1.288,0.87,1.649l-0.631,3.155C14.115,25.423,14.589,26,15.22,26h1.56c0.631,0,1.104-0.577,0.981-1.196l-0.631-3.155 C17.655,21.288,18,20.685,18,20z M16.149,21.845L16.78,25h-1.56l0.631-3.155l0.129-0.647l-0.544-0.373 C15.163,20.637,15,20.329,15,20c0-0.551,0.449-1,1-1s1,0.449,1,1c0,0.329-0.163,0.637-0.436,0.825l-0.544,0.373L16.149,21.845z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hinge */}
                  <div className="about-laptop-hinge" />

                  {/* Lower Chassis / Base */}
                  <div ref={laptopBaseRef} className="about-laptop-base">
                    <div className="about-laptop-notch" />
                  </div>

                  {/* Ambient Surface Shadow */}
                  <div ref={laptopShadowRef} className="about-laptop-shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
