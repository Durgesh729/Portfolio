import { ExternalLink, Github, Smartphone, Eye, ShoppingCart, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  tech: string[];
  gradient: string;
}

const projects: Project[] = [
  {
    title: "SWAP",
    description: "Flutter-based mobile application enabling QR-based product scanning with intelligent nearby shop suggestions for convenient shopping.",
    icon: Smartphone,
    tags: ["Mobile App", "E-Commerce"],
    tech: ["Flutter", "Supabase", "QR Scanner"],
    gradient: "from-emerald-500 to-teal-500"
  },
  {
    title: "Smart Image Recognition System",
    description: "Real-time object detection system utilizing advanced computer vision techniques for accurate image analysis and classification.",
    icon: Eye,
    tags: ["AI/ML", "Computer Vision"],
    tech: ["Python", "OpenCV", "PyTorch", "CNN", "Flask"],
    gradient: "from-primary to-secondary"
  },
  {
    title: "E-Commerce Web Platform",
    description: "Full-stack e-commerce solution with comprehensive product management, secure payments, and intuitive user experience.",
    icon: ShoppingCart,
    tags: ["Full Stack", "Web App"],
    tech: ["React", "Node.js", "MongoDB", "Stripe API"],
    gradient: "from-orange-500 to-rose-500"
  },
  {
    title: "Data Analytics Dashboard",
    description: "Interactive data visualization platform providing actionable insights through dynamic charts and real-time data processing.",
    icon: BarChart3,
    tags: ["Data Science", "Analytics"],
    tech: ["Pandas", "SQL", "Plotly", "Streamlit"],
    gradient: "from-violet-500 to-purple-500"
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary mb-4">
            Projects
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Work</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A collection of projects showcasing my skills in AI/ML, web development, and mobile applications
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="glass-card rounded-2xl overflow-hidden hover-lift glow-effect group"
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
              
              <div className="p-8">
                {/* Icon and Tags */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${project.gradient} p-3 flex items-center justify-center`}>
                    <project.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border/50 hover:bg-muted"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button
                    size="sm"
                    className={`flex-1 bg-gradient-to-r ${project.gradient} hover:opacity-90`}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
