import { useEffect, useRef } from "react";
import DecryptedText from "./DecryptedText";
import { initZigZagSkillRail } from "../utils/initZigZagSkillRail";
import "./SkillCards.css";

interface Skill {
  name: string;
  level: number;
  category: string;
  logo: string;
  isLottie?: boolean;
  description: string;
}

const skills: Skill[] = [
  {
    name: "Python",
    level: 90,
    category: "Programming",
    logo: "/images/skills/python_icon.png",
    description: ""
  },
  {
    name: "SQL",
    level: 90,
    category: "AI / ML Technologies",
    logo: "/images/skills/sql_logo.png",
    description: ""
  },
  {
    name: "NumPy",
    level: 85,
    category: "AI / ML Technologies",
    logo: "/images/skills/numpy_logo.png",
    description: ""
  },
  {
    name: "Pandas",
    level: 88,
    category: "AI / ML Technologies",
    logo: "/images/skills/pandas_logo.png",
    description: ""
  },
  {
    name: "Matplotlib",
    level: 80,
    category: "AI / ML Technologies",
    logo: "/images/skills/matplotlib_logo.png",
    description: ""
  },
  {
    name: "GitHub",
    level: 85,
    category: "Tools & Platforms",
    logo: "/images/skills/github_logo.png",
    description: ""
  },
  {
    name: "FastAPI",
    level: 90,
    category: "Tools & Platforms",
    logo: "/images/skills/fastapi_logo.png",
    description: ""
  },
  {
    name: "Docker",
    level: 60,
    category: "Tools & Platforms",
    logo: "/images/skills/docker_logo.png",
    description: ""
  }
];

const SkillsSection = () => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Initialize zig-zag animation with GSAP ScrollTrigger
    cleanupRef.current = initZigZagSkillRail({
      containerSelector: '#skills',
      railSelector: '.skills-rail',
      cardSelector: '.skill-card',
      amplitude: {
        desktop: 60,
        tablet: 30,
        mobile: 14
      },
      snap: true,
      enableKeyboardNav: true
    });

    // Cleanup on unmount
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <section id="skills" className="relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      {/* Section Header */}
      <div className="skills-section-header">
        <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-white mb-4">
          Skills
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          <span className="gradient-text">
            <DecryptedText
              text="Technical Expertise"
              animateOn="view"
              revealDirection="start"
              sequential={true}
              speed={100}
            />
          </span>
        </h2>
      </div>

      {/* Pinned Horizontal Scroll Container */}
      <div className="skills-pin-container" aria-label="Skills showcase" role="region">
        <div className="skills-rail" role="list">
          {skills.map((skill, index) => (
            <article
              key={skill.name}
              className="skill-card"
              role="listitem"
              tabIndex={0}
              data-index={index}
              data-skill={skill.name.toLowerCase().replace(/\s+/g, '-')}
              aria-label={`${skill.name}: ${skill.level}% proficiency`}
            >
              <div className="skill-card-inner">
                {/* macOS Top Toolbar */}
                <div className="card-toolbar">
                  <span className="toolbar-dot dot-red" />
                  <span className="toolbar-dot dot-yellow" />
                  <span className="toolbar-dot dot-green" />
                </div>

                {/* Background Logo */}
                <img
                  src={skill.logo}
                  alt=""
                  className="card-bg-logo"
                  loading="lazy"
                />

                {/* Card Content */}
                <div className="card-content">
                  <div className="card-category">{skill.category}</div>
                  <h3 className="card-title">{skill.name}</h3>
                  <p className="card-description">{skill.description}</p>

                  {/* Progress Bar */}
                  <p className="progress-label-text">ℙ𝕣𝕠𝕘𝕣𝕖𝕤𝕤</p>
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar-fill"
                      style={{ '--progress-width': `${skill.level}%` } as React.CSSProperties}
                    />
                    <div className="progress-bar-text">{skill.level}%</div>
                    <div className="progress-label">Proficiency</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
