import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import FuzzyText from "@/components/FuzzyText";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground sticky top-0 left-0 z-50">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative z-10">
          <FuzzyText baseIntensity={0.18} hoverIntensity={0.45}>
            404
          </FuzzyText>
        </div>
        <p className="mt-4 text-xl text-muted-foreground z-10 relative">Oops! Page not found</p>
        <a href="/" className="mt-4 text-primary underline hover:text-primary/90 z-10 relative">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
