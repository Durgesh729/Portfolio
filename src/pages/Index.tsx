import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LazySection from "@/components/ui/LazySection";
import AboutSection from "@/components/AboutSection";
import LaptopIntro from "@/components/LaptopIntro";

const Index = () => {
  return (
    <LaptopIntro>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="relative">
          {/* Sticky container wrapper with scroll height for frame animation */}
          <div
            id="hero-scroll-wrapper"
            data-exclude-cursor="true"
            className="relative w-full"
            style={{ height: "calc(100vh + 1000px)" }}
          >
            <div className="sticky top-0 z-0 h-screen w-full" data-exclude-cursor="true">
              <HeroSection />
            </div>
          </div>
          <div className="relative z-10 bg-background" id="portfolio-content">
            <AboutSection />
            <LazySection
              id="skills"
              importFunc={() => import("@/components/SkillsSection")}
              minHeight="600px"
            />
            <LazySection
              id="projects"
              importFunc={() => import("@/components/ProjectsSection")}
              minHeight="700px"
            />
            <LazySection
              id="education"
              importFunc={() => import("@/components/EducationSection")}
              minHeight="500px"
            />
            <LazySection
              id="contact"
              importFunc={() => import("@/components/ContactSection")}
              minHeight="600px"
            />

          </div>
        </main>
      </div>
    </LaptopIntro>
  );
};

export default Index;
