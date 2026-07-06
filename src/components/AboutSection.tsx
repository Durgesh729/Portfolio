import TextType from "./TextType";
import { Code2, Brain, Users, Workflow, Lightbulb, Zap, Target, Rocket } from "lucide-react";
import TraitsCard from "./Traits";
import DecryptedText from "./DecryptedText";
import AnimatedContent from "./AnimatedContent";
import FriendsStack from "./FriendsStack";
import "./AboutSection.css";

import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("standard", "0.4, 0.0, 0.2, 1");

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const whoIAmRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top 30%",
          scrub: 1,
        }
      });

      tl.from(featureCardsRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "standard",
        clearProps: "all"
      });

      gsap.from(whoIAmRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top 30%",
          scrub: 1,
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "standard",
        clearProps: "all"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative about-section">
      {/* Curve attached to the top of AboutSection so it scrolls up with it */}
      <div className="absolute top-[-149px] left-0 w-full h-[150px] z-20 pointer-events-none leading-[0]">
        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="block w-full h-full">
          <path d="M0 150 C 360 0 1080 0 1440 150 Z" fill="#050816"></path>
        </svg>
      </div>

      <div className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-card/20 to-background" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-white mb-4">
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">
                <DecryptedText
                  text="About Me"
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  speed={100}
                />
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Description */}
            <div className="space-y-6">
              <div ref={whoIAmRef} className="glass-card p-8 rounded-2xl hover-lift">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Rocket className="text-primary" />
                  <div className="hello-wrapper-about">
                    <div className="loader-about">
                      <div className="words-about">
                        <span className="word-about"></span>
                        <span className="word-about">नमस्ते</span>
                        <span className="word-about">வணக்கம்</span>
                        <span className="word-about">Hello</span>
                        <span className="word-about">ہیلو</span>
                      </div>
                    </div>
                  </div>
                </h3>
                <div className="text-muted-foreground leading-relaxed mb-6 font-medium">
                  <TextType
                    text={[
                      "I'm a Computer Science Engineering student specializing in Artificial Intelligence and Machine Learning. My curiosity drives me to explore the boundaries of what's possible with technology.",
                      "As a dedicated problem-solver and continuous learner, I'm focused on building intelligent and impactful solutions that can make a real difference in people's lives."
                    ]}
                    typingSpeed={45}
                    pauseDuration={800}
                    deletingSpeed={0}
                    loop={false}
                    showCursor={true}
                    hideCursorWhileTyping={false}
                    cursorCharacter="|"
                  />
                </div>
              </div>

              {/* Traits Card */}
              <div className="mt-8 flex justify-center sm:justify-start">
                <TraitsCard />
              </div>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="space-y-8">

              {/* Unique Feature Cards Grid */}
              <div className="grid sm:grid-cols-2 gap-4" ref={featuresRef}>

                {/* Card 1: Programming — Terminal Style */}
                <div
                  ref={(el) => { if (el) featureCardsRef.current[0] = el }}
                  className="feature-card feature-card--terminal"
                >
                  <div className="terminal-topbar">
                    <span className="terminal-dot dot-red" />
                    <span className="terminal-dot dot-yellow" />
                    <span className="terminal-dot dot-green" />
                    <span className="terminal-title">main.py</span>
                  </div>
                  <div className="terminal-body">
                    <div className="terminal-icon-wrap">
                      <Code2 className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className="terminal-heading">Programming</h4>
                    <p className="terminal-line"><span className="terminal-prompt">$&gt;</span> Python · Robust Scripts</p>
                    <p className="terminal-desc">Proficient in Python, with experience in building robust applications and scripts.</p>
                  </div>
                </div>

                {/* Card 2: Resume Button — placed in grid slot */}
                <div
                  ref={(el) => { if (el) featureCardsRef.current[1] = el }}
                  className="feature-card feature-card--resume-slot"
                >
                  <div className="conti">
                    <input type="checkbox" id="unlock-toggle" hidden />
                    <label className="swipe" htmlFor="unlock-toggle" onClick={handleResumeDownload}>
                      <div className="glow"></div>
                      <div className="knob">
                        <svg className="lock" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="11" width="12" height="10" rx="2" ry="2" fill="#00000000" stroke="#7a929d86" strokeWidth="1.6"></rect>
                          <path d="M8.5 11V8.5A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 3.5 3.5V11" fill="none" stroke="#7a929d86" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                        <svg className="lock-glow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <rect x="6" y="11" width="12" height="10" rx="2" ry="2" fill="#00000000" stroke="#7a929d" strokeWidth="1.6"></rect>
                          <path d="M8.5 11V8.5A3.5 3.5 0 0 1 12 5a3.5 3.5 0 0 1 3.5 3.5V11" fill="none" stroke="#7a929d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <div className="label-alt">
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
                      <div className="label">
                        <span>D</span><span>o</span><span>w</span><span>n</span><span>l</span><span>o</span><span>a</span><span>d</span>
                        <span>&nbsp;</span>
                        <span>R</span><span>e</span><span>s</span><span>u</span><span>m</span><span>e</span>
                      </div>
                    </label>

                    <svg className="ripple" version="1.1" xmlns="http://www.w3.org/2000/svg" width="329" height="69" viewBox="0,0,329,69">
                      <g transform="translate(166.34519,34.05402)">
                        <g fill="none" stroke="#aaaaaa22" strokeWidth="3" strokeMiterlimit="10">
                          <path d="M-164.84519,-4.27474c0,-16.1705 12.23994,-28.27928 28.41044,-28.27928c0.62712,0 269.76321,0.01971 270.38053,0.05856c14.48923,0.91174 26.11884,12.36192 27.31149,26.7732c0.06679,0.807 -0.23249,12.13079 -0.23249,12.95503c0,16.1705 -12.08038,26.27928 -28.25088,26.27928c-0.53766,0 -269.75928,-0.01449 -270.2898,-0.0431c-13.76896,-0.74265 -25.0656,-12.1284 -27.26126,-25.61178c-0.26413,-1.62197 -0.06804,-10.45329 -0.06804,-12.1319z"></path>
                        </g>
                      </g>
                    </svg>

                    <svg className="particles" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,25,28">
                      <g transform="translate(23.16486,16.9609)">
                        <g strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10">
                          <path d="M-8.60292,-15.4609l9.72436,11.28025"></path>
                          <path d="M-17.88391,-3.73728l14.00307,5.05667"></path>
                          <path d="M-21.66486,9.43345h14.39205"></path>
                        </g>
                      </g>
                    </svg>

                    <svg className="clank" version="1.1" xmlns="http://www.w3.org/2000/svg" width="39" height="64" viewBox="0,0,39,64">
                      <g transform="translate(2.70145,41.30984)">
                        <g fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeMiterlimit="10">
                          <path d="M0.31997,-7.0285l16.51652,-31.53153l16.51652,21.02102z"></path>
                          <path d="M4.82448,1.98051l22.52252,1.5015l-9.00901,16.51652z"></path>
                        </g>
                      </g>
                    </svg>

                    <div className="key">
                      <svg width="128" height="128" viewBox="0 0 20 20">
                        <path fill="transparent" stroke="#777f82" strokeWidth="0.5" d="M 14 1 C 10.692214 1 8 3.6922138 8 7 C 8.0009187 7.6566689 8.1675322 8.2941025 8.3789062 8.9140625 L 0.14648438 17.146484 A 0.50005 0.50005 0 0 0 0 17.5 L 0 19.5 A 0.50005 0.50005 0 0 0 0.5 20 L 3.5 20 A 0.50005 0.50005 0 0 0 3.8535156 19.853516 L 4.7070312 19 L 6.5 19 A 0.50005 0.50005 0 0 0 7 18.5 L 7 17 L 8.5 17 A 0.50005 0.50005 0 0 0 9 16.5 L 9 14.707031 L 11.408203 12.298828 C 12.222493 12.696518 13.08808 12.998007 13.998047 13 A 0.50005 0.50005 0 0 0 14 13 C 17.307786 13 20 10.307786 20 7 C 20 3.6922138 17.307786 1 14 1 z M 14 2 C 16.767346 2 19 4.2326539 19 7 C 19 9.7666799 16.768376 11.998925 14.001953 12 C 13.122276 11.9981 12.258393 11.764657 11.498047 11.322266 A 0.50005 0.50005 0 0 0 10.892578 11.400391 L 8.1464844 14.146484 A 0.50005 0.50005 0 0 0 8 14.5 L 8 16 L 6.5 16 A 0.50005 0.50005 0 0 0 6 16.5 L 6 18 L 4.5 18 A 0.50005 0.50005 0 0 0 4.1464844 18.146484 L 3.2929688 19 L 1 19 L 1 17.707031 L 9.2675781 9.4394531 A 0.50005 0.50005 0 0 0 9.3769531 8.8964844 C 9.1293039 8.2948851 9.0009101 7.6505774 9 7 C 9 4.2326539 11.232654 2 14 2 z M 15 3 C 13.901353 3 13 3.9013528 13 5 C 13 6.0986472 13.901353 7 15 7 C 16.098647 7 17 6.0986472 17 5 C 17 3.9013528 16.098647 3 15 3 z M 15 4 C 15.558207 4 16 4.4417929 16 5 C 16 5.5582071 15.558207 6 15 6 C 14.441793 6 14 5.5582071 14 5 C 14 4.4417929 14.441793 4 15 4 z"></path>
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

                    <svg className="big-lock" viewBox="0 0 120 120">
                      <path fill="none" stroke="#c7cfd2" strokeWidth="0.5" d="M23,14l0-4.706c0-3.833-2.953-7.175-6.785-7.29C12.251,1.884,9,5.062,9,9v5H8c-1.657,0-3,1.343-3,3v10, c0,1.657,1.343,3,3,3h16c1.657,0,3-1.343,3-3V17c0-1.657-1.343-3-3-3H23z M10,9c0-3.308,2.692-6,6-6s6,2.692,6,6v5h-1V9 c0-2.757-2.243-5-5-5s-5,2.243-5,5v5h-1V9z M20,14h-8V9c0-2.209,1.791-4,4-4s4,1.791,4,4V14z M24,29H8c-1.105,0-2-0.895-2-2V17 c0-1.105,0.895-2,2-2h16c1.105,0,2,0.895,2,2v10C26,28.105,25.105,29,24,29z M18,20c0-1.105-0.895-2-2-2s-2,0.895-2,2 c0,0.685,0.345,1.288,0.87,1.649l-0.631,3.155C14.115,25.423,14.589,26,15.22,26h1.56c0.631,0,1.104-0.577,0.981-1.196l-0.631-3.155 C17.655,21.288,18,20.685,18,20z M16.149,21.845L16.78,25h-1.56l0.631-3.155l0.129-0.647l-0.544-0.373 C15.163,20.637,15,20.329,15,20c0-0.551,0.449-1,1-1s1,0.449,1,1c0,0.329-0.163,0.637-0.436,0.825l-0.544,0.373L16.149,21.845z"></path>
                    </svg>
                  </div>
                </div>

                {/* Card 3: Team Collaboration — Board Style */}
                <div
                  ref={(el) => { if (el) featureCardsRef.current[2] = el }}
                  className="feature-card feature-card--collab"
                >
                  <div className="collab-header">
                    <Users className="w-5 h-5 text-[#464bc4]" />
                    <span className="collab-badge">Active</span>
                  </div>
                  <h4 className="collab-heading">Team Collaboration</h4>
                  <p className="collab-desc">Effective communicator with experience in agile methodologies and team projects.</p>
                  <div className="collab-avatars">
                    <FriendsStack />
                  </div>
                </div>

                {/* Card 4: Workflow Design — Merge Tooltip Style */}
                <div
                  ref={(el) => { if (el) featureCardsRef.current[3] = el }}
                  className="tooltip-container"
                >
                  <div className="trigger-wrapper">
                    <svg className="branch-path-svg" viewBox="0 0 300 60">
                      <path
                        className="branch-line line-left"
                        d="M150,0 C150,25 60,25 60,60"
                        fill="none"
                        stroke="#464bc4"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        className="branch-line line-right"
                        d="M150,0 C150,25 240,25 240,60"
                        fill="none"
                        stroke="#238636"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <circle cx="60" cy="60" r="3" className="branch-dot dot-left" fill="#464bc4"></circle>
                      <circle cx="240" cy="60" r="3" className="branch-dot dot-right" fill="#238636"></circle>
                    </svg>

                    <button className="merge-btn flex-col !items-start gap-2">
                      <div className="flex items-center text-lg">
                        <Workflow className="w-5 h-5 mr-3 text-[#464bc4]" />
                        Workflow Design
                      </div>
                      <div className="text-[13px] text-[#8c91ffcc] font-normal leading-[1.6] text-left">
                        Skilled in designing efficient workflows and automating repetitive tasks.
                      </div>
                    </button>
                  </div>

                  <div className="tooltips-wrapper">
                    <div className="tooltip-content" style={{ borderLeft: "2px solid #00f2ffff" }}>
                      <div className="tooltip-header" style={{ color: "#00f2ffff" }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path>
                        </svg>
                        <span>Code Works (Don't Touch)</span>
                      </div>
                      <div className="tooltip-info">Code Held Together by Hope</div>
                    </div>

                    <div className="tooltip-content" style={{ borderLeft: "2px solid #00f2ffff" }}>
                      <div className="tooltip-header" style={{ color: "#00f2ffff" }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        </svg>
                        <span>client Satisfied </span>
                      </div>
                      <div className="tooltip-info">who Changes mind in 3 days</div>
                    </div>
                  </div>
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
