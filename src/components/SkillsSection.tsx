import { useEffect, useRef } from "react";
import DecryptedText from "./DecryptedText";
import { initZigZagSkillRail } from "../utils/initZigZagSkillRail";
import BorderGlow from "./BorderGlow";
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
    name: "Scikit Learn",
    level: 85,
    category: "AI / ML Technologies",
    logo: "/images/skills/scikit-learn-logo.png",
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
              aria-label={skill.name}
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="hsl(var(--card) / 0.6)"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated={false}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
                className="w-full h-full"
              >
                <img
                  src={skill.logo}
                  alt=""
                  width={180}
                  height={180}
                  className="card-bg-logo"
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                />

                {/* Card Content */}
                <div className="card-content">
                  <div className="card-category">{skill.category}</div>
                  <h3 className="card-title">{skill.name}</h3>
                  {skill.description ? (
                    <p className="card-description">{skill.description}</p>
                  ) : null}
                </div>
              </BorderGlow>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
