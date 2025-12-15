import { Code2, Brain, Users, Workflow, Lightbulb, Zap, Target, Rocket } from "lucide-react";

const traits = [
  "Problem Solver",
  "Quick Learner", 
  "Team Player",
  "Innovation Focused"
];

const features = [
  {
    icon: Code2,
    title: "Programming",
    description: "Proficient in Python, with experience in building robust applications and scripts."
  },
  {
    icon: Brain,
    title: "AI/ML",
    description: "Specialized in machine learning algorithms, neural networks, and data analysis."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Effective communicator with experience in agile methodologies and team projects."
  },
  {
    icon: Workflow,
    title: "Workflow Design",
    description: "Skilled in designing efficient workflows and automating repetitive tasks."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Get to <span className="gradient-text">Know Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            I'm a passionate learner on a mission to create intelligent solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Description */}
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-2xl hover-lift">
              <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                <Rocket className="text-primary" />
                Who I Am
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'm a <span className="text-foreground font-medium">third-year Computer Science Engineering student</span> specializing 
                in Artificial Intelligence and Machine Learning. My curiosity drives me to explore 
                the boundaries of what's possible with technology.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As a dedicated <span className="text-foreground font-medium">problem-solver</span> and 
                <span className="text-foreground font-medium"> continuous learner</span>, I'm focused on building 
                intelligent and impactful solutions that can make a real difference in people's lives.
              </p>
            </div>

            {/* Traits Tags */}
            <div className="flex flex-wrap gap-3">
              {traits.map((trait, index) => (
                <span
                  key={trait}
                  className="px-4 py-2 glass-card rounded-full text-sm font-medium text-foreground border border-primary/30 hover:border-primary/60 transition-colors cursor-default"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 rounded-2xl hover-lift glow-effect group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
