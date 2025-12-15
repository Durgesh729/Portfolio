import { GraduationCap, Award, BookOpen, Sparkles } from "lucide-react";

const education = [
  {
    degree: "B.Tech Computer Science Engineering (AI & ML)",
    institution: "Gharda Institute of Technology, India",
    period: "2023 – 2027",
    status: "Third Year – TE",
    icon: GraduationCap
  },
  {
    degree: "HSC (Science Stream)",
    institution: "Higher Secondary Education",
    period: "2021 – 2023",
    status: "Completed",
    icon: BookOpen
  }
];

const certifications = [
  {
    name: "Machine Learning Specialization",
    provider: "Coursera",
    icon: "🤖"
  },
  {
    name: "Python for Data Science",
    provider: "edX",
    icon: "🐍"
  },
  {
    name: "Web Development Bootcamp",
    provider: "Udemy",
    icon: "💻"
  }
];

const currentlyLearning = [
  "Advanced Deep Learning",
  "Cloud Computing (AWS)",
  "DevOps"
];

const EducationSection = () => {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary mb-4">
            Education
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Learning <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            My academic background and continuous pursuit of knowledge
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Education Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <GraduationCap className="text-primary" />
              Education
            </h3>
            
            {education.map((edu, index) => (
              <div
                key={edu.degree}
                className="glass-card p-6 rounded-2xl hover-lift relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
                
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <edu.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{edu.degree}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{edu.institution}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {edu.period}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {edu.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Certifications & Learning Column */}
          <div className="space-y-8">
            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                <Award className="text-primary" />
                Certifications
              </h3>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.name}
                    className="glass-card p-5 rounded-xl hover-lift flex items-center gap-4"
                  >
                    <span className="text-2xl">{cert.icon}</span>
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">{cert.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currently Learning */}
            <div className="glass-card p-6 rounded-2xl gradient-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Sparkles className="text-secondary" />
                Currently Learning
              </h3>
              <div className="flex flex-wrap gap-3">
                {currentlyLearning.map((topic) => (
                  <span
                    key={topic}
                    className="px-4 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/30 text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
