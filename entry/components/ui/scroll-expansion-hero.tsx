'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollExpandMedia({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<'laptop' | 'expand' | 'complete'>('laptop');
  const [scaleFactor, setScaleFactor] = useState(1);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 }); // Default avoids divide by zero

  useEffect(() => {
    // Calculate dynamic scale to ensure laptop fills screen exactly
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWindowSize({ width: w, height: h });

      // 518 is the fixed width of the laptop screen .screen class
      // We need the laptop #screen to cover the viewport.
      // Screen aspect: 518 / 318 = 1.62
      // Viewport aspect varies.

      // Calculate scale required for 518px to cover window width
      const scaleX = w / 518;
      const scaleY = h / 318;

      // Use the larger scale to ensure coverage (cover mode)
      // Multiply by slightly more (e.g. 1.2) to ensure the bezel/keyboard is blown out of view if desired, 
      // OR just enough to fill content.
      // The bezel is outside the 518x318 screen. 
      // If we scale the CONTENT to match viewport, we want the Screen inner to match viewport.
      // So logic: laptopScale * 518 = viewportWidth. -> laptopScale = viewportWidth / 518.

      const maxScale = Math.max(scaleX, scaleY);
      setScaleFactor(maxScale);
    };

    handleResize(); // Initial
    window.addEventListener('resize', handleResize);

    // Timer for animation sequence
    const timer = setTimeout(() => {
      setPhase('expand');
    }, 4000); // 4s video/static -> expand

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const handleAnimationComplete = () => {
    if (phase === 'expand') {
      setPhase('complete');
    }
  };

  // Inverse scale for the content so it looks "normal" at the end of expansion
  // When laptop scale is 1 (during laptop phase), content should be scaled DOWN to fit in the 518px box.
  // Inverse scale = 518 / windowWidth.
  // Actually, we want the content to be responsive to the window size even when inside the laptop?
  // Yes: Render at Window Size, Scale Down.
  const contentScale = 518 / windowSize.width;

  return (
    <section className={`min-h-screen bg-black overflow-hidden ${phase === 'complete' ? 'overflow-visible h-auto flex-col' : 'flex items-center justify-center fixed inset-0 z-50'}`}>

      {phase === 'complete' ? (
        <div className="w-full h-full relative z-10 bg-white dark:bg-black fade-in-content">
          {children}
        </div>
      ) : (
        <motion.div
          className={`laptop ${phase === 'expand' ? 'expanding' : ''}`}
          initial={{ scale: 0.8 }}
          // We zoom nicely to the calculated scale factor
          animate={phase === 'expand' ? { scale: scaleFactor } : { scale: 0.8 }}
          transition={{ duration: 1.5, ease: [0.6, 0.05, -0.01, 0.9] }} // Custom bezier for "screen swoop" feel
          onAnimationComplete={handleAnimationComplete}
        >
          <div className={`screen ${phase === 'expand' ? 'expanding' : ''}`}>
            <div className="header" />

            {/* CONTENT CONTAINER */}
            <div className="content-container">
              {/* 
                                Inverse Scaling Wrapper:
                                Maintains aspect ratio of the real window inside the laptop screen.
                            */}
              <div
                className="scaled-content-wrapper"
                style={{
                  width: windowSize.width,
                  height: windowSize.height,
                  transform: `scale(${contentScale})`,
                  transformOrigin: 'top left'
                }}
              >
                {children}
              </div>
            </div>

            {/* WELCOME TEXT */}
            {/* We hide text immediately on expand or keep it? Specs said fade out. */}
            <div className="terminal-loader">
              <div className="terminal-header">
                <div className="terminal-title">Status</div>
                <div className="terminal-controls">
                  <div className="control close"></div>
                  <div className="control minimize"></div>
                  <div className="control maximize"></div>
                </div>
              </div>
              <div className="text">Initializing Durgesh&apos;s Portfolio...</div>
            </div>
          </div>

          <div className="keyboard" />
        </motion.div>
      )}

    </section>
  );
}
