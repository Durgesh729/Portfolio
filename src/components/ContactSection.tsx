import { useState, useEffect } from 'react';
import ScrollExpand from './ScrollExpand';
import FollowMeCard from './FollowMeCard';
import FlippableProfileCard from './FlippableProfileCard';
import MaskedHeading from './MaskedHeading';
import './ContactSection.css';

const ContactSection = () => {
  const [contactRevealed, setContactRevealed] = useState(false);
  const [memoriesVisible, setMemoriesVisible] = useState(false);
  const [isMemoriesHovered, setIsMemoriesHovered] = useState(false);
  const [activeView, setActiveView] = useState<'contact' | 'memories'>('contact');
  const [hasSeenMemories, setHasSeenMemories] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [memoriesMounted, setMemoriesMounted] = useState(false);

  const isMemoriesActive = activeView === 'memories' || isSliding;

  // Preload the memories iframe once contact section is revealed or hovered
  useEffect(() => {
    if (contactRevealed || isMemoriesHovered) {
      setMemoriesMounted(true);
    }
  }, [contactRevealed, isMemoriesHovered]);

  const handleOpenMemories = () => {
    setMemoriesMounted(true);
    setIsSliding(true);
    setActiveView('memories');
    setHasSeenMemories(true);
    document.body.classList.add('memories-view-active');
    document.body.classList.remove('target-cursor-hidden');
    // Pause Lenis smooth scrolling so background page doesn't scroll during 3D book interaction
    window.lenisInstance?.stop();
  };

  const handleBackToContact = () => {
    setIsSliding(true);
    setActiveView('contact');
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsSliding(false);
      if (activeView === 'contact') {
        document.body.classList.remove('memories-view-active');
        // Resume Lenis smooth scrolling
        window.lenisInstance?.start();
      }
    }
  };

  // Keep body class synced with memories state so normal cursor is applied
  useEffect(() => {
    if (isMemoriesActive) {
      document.body.classList.add('memories-view-active');
      document.body.classList.remove('target-cursor-hidden');
    } else {
      document.body.classList.remove('memories-view-active');
    }
    return () => {
      document.body.classList.remove('memories-view-active');
    };
  }, [isMemoriesActive]);

  // Listen for the "contact section" button click inside the memories iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate event origin against current origin to prevent cross-origin injection
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) {
        return;
      }
      if (event.data?.type === 'NAVIGATE_TO_CONTACT') {
        handleBackToContact();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeView === 'memories') {
        handleBackToContact();
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeView]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (contactRevealed || hasSeenMemories) {
      if (hasSeenMemories) {
        setMemoriesVisible(true);
      } else {
        // Wait 5 seconds after all contact info is revealed
        timer = setTimeout(() => {
          setMemoriesVisible(true);
        }, 5000);
      }
    } else {
      // Fade out when scrolling away
      setMemoriesVisible(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [contactRevealed, hasSeenMemories]);

  return (
    <section id="contact" className="contact-section-container">
      <ScrollExpand
        useWindowScroll={true}
        title="Let's Connect"
        onRevealChange={setContactRevealed}
        postTitle={
          <div className="contact-wrapper">
            <div className="contact-left">
              <div className="contact-copy">
                <p className="contact-copy__line">
                  <span className="contact-copy__sans">
                    Have a project in mind &apos; or
                  </span>
                </p>
                <p className="contact-copy__line">
                  <span className="contact-copy__sans contact-copy__sans--bold">&nbsp;</span>
                  <span className="contact-copy__italic">
                    just want to chat?
                  </span>
                </p>
                <p className="contact-copy__line">
                  <span className="contact-copy__italic">Feel free to reach out!</span>
                </p>
              </div>

              <div className={`memories-heading-wrap ${memoriesVisible ? 'memories-heading-wrap--visible' : ''}`}>
                <div
                  className="memories-btn-group"
                  role="button"
                  tabIndex={0}
                  onClick={handleOpenMemories}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleOpenMemories();
                    }
                  }}
                  onMouseEnter={() => setIsMemoriesHovered(true)}
                  onMouseLeave={() => setIsMemoriesHovered(false)}
                >
                  <MaskedHeading
                    text="My memories"
                    mediaType="video"
                    src="/reel.mp4"
                    poster="/hero.jpg"
                    fillScale={1.25}
                    parallax={26}
                    reveal="fade"
                    trigger="view"
                    drift={18}
                    brightness={1}
                    saturation={1}
                    grayscale={false}
                    duration={1.1}
                    stagger={0.09}
                    align="left"
                    weight={700}
                    tracking={-0.03}
                    lineHeight={1.06}
                    textScale={0.08}
                    underline
                    isHovered={isMemoriesHovered}
                    onHoverChange={setIsMemoriesHovered}
                    onClick={handleOpenMemories}
                  />

                  <div
                    className={`svg-name-con ${isMemoriesHovered ? 'is-hovered' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label="My memories"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMemories();
                    }}
                    onMouseEnter={() => setIsMemoriesHovered(true)}
                    onMouseLeave={() => setIsMemoriesHovered(false)}
                  >
                    <div className="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="34"
                        height="34"
                      >
                        <defs>
                          <linearGradient id="memories-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#7c3aed" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#c084fc" />
                          </linearGradient>
                        </defs>
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="url(#memories-arrow-gradient)"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <FollowMeCard />
            </div>

            <div className="contact-right">
              <FlippableProfileCard />
            </div>
          </div>
        }
        mediaZoom={1.35}
        startWidth={26}
        startHeight={38}
        startRadius={24}
        endRadius={0}
        scrollDistance={1.0}
        holdDistance={0.5}
        smoothing={0.2}
        overlayScrim={0.45}
        enabled
      />

      {/* Fullscreen Memories Overlay */}
      {isMemoriesActive && (
        <div className="memories-overlay-root" data-exclude-cursor="true">
          <div
            className={`memories-slider ${activeView === 'memories' ? 'memories-slider--visible' : ''}`}
            onTransitionEnd={handleTransitionEnd}
            data-exclude-cursor="true"
          >
            {memoriesMounted && (
              <iframe
                src="/memories/index.html"
                title="Durgesh padval Memories"
                className="memories-iframe"
                data-exclude-cursor="true"
                allow="autoplay"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;
