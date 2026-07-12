import React, { Suspense, useState, useEffect, useRef } from "react";
import "./LazySection.css";

interface LazySectionProps {
  importFunc: () => Promise<{ default: React.ComponentType<Record<string, never>> }>;
  fallback?: React.ReactNode;
  minHeight?: string;
  id?: string;
  className?: string;
}

const LazySection = ({
  importFunc,
  fallback,
  minHeight = "400px",
  id,
  className
}: LazySectionProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize lazy component so we don't re-create it on every render
  const LazyComponent = React.useMemo(() => React.lazy(importFunc), [importFunc]);

  useEffect(() => {
    // 1. Instantly load if this section is the current URL hash target (e.g. initial load at #projects)
    const checkHash = () => {
      if (id && window.location.hash === `#${id}`) {
        setShouldRender(true);
      }
    };

    checkHash();

    window.addEventListener("hashchange", checkHash);

    // 2. Load via IntersectionObserver on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldRender(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "250px", // Preload 250px before entering viewport
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      window.removeEventListener("hashchange", checkHash);
      observer.disconnect();
    };
  }, [id]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ minHeight: shouldRender ? undefined : minHeight }}
    >
      {shouldRender ? (
        <Suspense fallback={fallback || <div className="lazy-section-placeholder" style={{ height: minHeight }} />}>
          <LazyComponent />
        </Suspense>
      ) : (
        fallback || <div className="lazy-section-placeholder" style={{ height: minHeight }} />
      )}
    </div>
  );
};

export default LazySection;
