import { Github, Linkedin, Mail, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-glow animation-delay-500" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Greeting */}
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-muted-foreground mb-6">
              Welcome to my portfolio
            </span>
          </div>

          {/* Main Headline */}
          <h1 
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Hi, I'm{" "}
            <span className="gradient-text">Durgesh Padwal</span>
          </h1>

          {/* Subheading */}
          <h2 
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4 animate-fade-up opacity-0"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Computer Science Engineering Student
          </h2>

          {/* Specialization Badge */}
          <div 
            className="animate-fade-up opacity-0 mb-8"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Artificial Intelligence & Machine Learning
            </span>
          </div>

          {/* Description */}
          <p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0"
            style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
          >
            Passionate about leveraging AI and Machine Learning to solve real-world problems. 
            I build intelligent solutions that make a meaningful impact, combining creativity 
            with cutting-edge technology.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up opacity-0"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            <Button 
              size="lg"
              className="bg-primary-gradient hover:opacity-90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl glow-effect"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 px-8 py-6 text-lg font-semibold rounded-xl"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
          </div>

          {/* Social Icons */}
          <div 
            className="flex items-center justify-center gap-4 animate-fade-up opacity-0"
            style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card hover-lift rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card hover-lift rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:durgesh@example.com"
              className="p-3 glass-card hover-lift rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <a href="#about" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
          <ChevronDown size={24} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
