import { ExternalLink, Github, Smartphone, BarChart3, ShieldAlert, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import DecryptedText from "./DecryptedText";

interface Project {
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  tech: string[];
  gradient: string;
  github: string;
  demo?: string;
}

const projects: Project[] = [
  {
    title: "Dataset Poisoning Detection",
    description: "Dataset poisoning is a security threat where an attacker injects malicious data into a training set to compromise the integrity of a machine learning model.",
    icon: ShieldAlert,
    tags: ["Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "PyTorch"],
    gradient: "from-red-500 to-orange-500",
    github: "https://github.com/Durgesh729/AI-that-detect-Dataset-Poisoning.git"
  },
  {
    title: "Loan Approval",
    description: "This project uses Machine Learning to predict evaluation whether a loan application will be approved based on applicant details & factors.",
    icon: CheckSquare,
    tags: ["Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "Numpy", "Pandas", "html", "FastAPI", "css"],
    gradient: "from-emerald-500 to-teal-500",
    github: "https://github.com/Durgesh729/Loan-Approval.git"
  },
  {
    title: "Multi-Tier Academic Workflow with RBAC",
    description: "Enabling mentors, mentees, HODs and coordinators to collaborate seamlessly with cutting-edge technology and intuitive design.",
    icon: Smartphone,
    tags: ["Full-Stack", "REST APIs", "React", "PostgreSQL"],
    tech: ["javascript", "REST APIs", "React", "PostgreSQL"],
    gradient: "from-blue-500 to-indigo-500",
    github: "https://github.com/Durgesh729/Multi-Tier-Academic-Workflow-with-RBAC.git"
  },
  {
    title: "Smart Business Analytics",
    description: "This project let users easily upload their sales data to receive interactive visual analytics .",
    icon: BarChart3,
    tags: ["Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "Numpy", "Pandas", "Matplotlib", "Plotly", "Seaborn"],
    gradient: "from-violet-500 to-purple-500",
    github: "https://github.com/Durgesh729/Smart-Buisiness-Analytics.git"
  }
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="pt-24 pb-10 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-white mb-4">
            Projects
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">
              <DecryptedText
                text="Featured Work"
                animateOn="view"
                revealDirection="start"
                sequential={true}
                speed={100}
              />
            </span>
          </h2>
        </div>

        {/* Scroll Stack Projects */}
        <ScrollStack
          itemDistance={50}
          itemStackDistance={30}
          itemScale={0.03}
          stackPosition="20%"
          useWindowScroll={true} // Enable window scrolling
        >
          {projects.map((project, index) => (
            <ScrollStackItem key={project.title}>
              <div
                className="glass-card rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] glow-effect group h-full shadow-lg border border-white/10"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />

                <div className="p-8 h-full flex flex-col">
                  {/* Icon and Tags */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${project.gradient} p-3 flex items-center justify-center shrink-0`}>
                      <project.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
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
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-base leading-relaxed flex-grow">
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
                  <div className="flex gap-3 mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50 hover:bg-muted"
                      onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    {project.demo && (
                      <Button
                        size="sm"
                        className={`flex-1 bg-gradient-to-r ${project.gradient} hover:opacity-90`}
                        onClick={() => window.open(project.demo, "_blank", "noopener,noreferrer")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
};

export default ProjectsSection;
