import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";
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
            <SkillsSection />
            <ProjectsSection />
            <EducationSection />
            <ContactSection />
          </div>
        </main>
      </div>
    </LaptopIntro>
  );
};

export default Index;
