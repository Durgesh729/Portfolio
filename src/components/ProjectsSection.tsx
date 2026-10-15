import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ExternalLink, Github, Smartphone, BarChart3, ShieldAlert, CheckSquare, ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import DecryptedText from "./DecryptedText";
import Folder, { FolderItem } from "./Folder";
import "./ProjectsSection.css";

const poisoningFolderItems: FolderItem[] = [
  {
    title: "Pipeline Workflow",
    image: "/images/projects/pipeline-workflow.png?v=3",
    aspectRatio: 1017 / 563, // 16:9 Landscape Architecture Diagram
  },
  {
    title: "Performance & Quality Metrics",
    image: "/images/projects/performance-metrics.jpg?v=3",
    aspectRatio: 1000 / 680, // Landscape Benchmark Metrics Chart
  },
  {
    title: "Implementation & Defense Stages",
    image: "/images/projects/pipeline-stages.png?v=3",
    aspectRatio: 512 / 650, // Portrait Defense Stages Table
  },
];

const loanFolderItems: FolderItem[] = [
  {
    title: "Pipeline Architecture & Workflow",
    image: "/images/projects/loan-workflow.jpg",
    aspectRatio: 702 / 507, // 1.385 Architecture & Pipeline Flowchart
  },
  {
    title: "Dataset & Credit Risk Features",
    image: "/images/projects/loan-dataset.jpg",
    aspectRatio: 1024 / 681, // 1.504 Feature Specification Matrix
  },
];

const feedbackFolderItems: FolderItem[] = [
  {
    title: "NLP & ML Workflow",
    image: "/images/projects/feedback-workflow.jpg",
    aspectRatio: 850 / 385, // 2.208 Landscape Architecture Workflow Diagram
  },
  {
    title: "Sentiment Distribution",
    image: "/images/projects/feedback-sentiment.jpg",
    aspectRatio: 1024 / 731, // 1.401 Sentiment Distribution Bar Chart
  },
  {
    title: "Category Evaluation Report",
    image: "/images/projects/feedback-evaluation.jpg",
    aspectRatio: 846 / 742, // 1.140 Multi-Domain Evaluation Matrix
  },
  {
    title: "Technology Stack",
    image: "/images/projects/feedback-tech-stack.jpg",
    aspectRatio: 882 / 333, // 2.649 Landscape Tech Specs Card
  },
];

const analyticsFolderItems: FolderItem[] = [
  {
    title: "Interactive Analytics Dashboard",
  },
  {
    title: "Sales Forecasting Model",
  },
  {
    title: "Business Performance Metrics",
  },
];

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
    description: `Dataset poisoning is a security threat where an attacker injects malicious data into a training set to compromise the integrity of a machine learning model. Implemented multiple detection techniques:
• Isolation Forest for unsupervised anomaly detection
• Autoencoder for reconstruction-error-based poison detection
• Influence Functions (TracIn Proxy) to identify highly influential training samples
• Trust Score using classifier and k-NN agreement for sample reliability.`,
    icon: ShieldAlert,
    tags: ["Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "PyTorch"],
    gradient: "from-red-500 to-orange-500",
    github: "https://github.com/Durgesh729/AI-that-detect-Dataset-Poisoning.git"
  },
  {
    title: "Loan Approval",
    description: `An end-to-end Machine Learning credit risk assessment system predicting loan application approval with high precision based on financial and credit profiles:
• Multi-step application workflow with responsive UI & FastAPI inference backend
• Comprehensive preprocessing with categorical encoding, missing value handling & scaling
• Random Forest Classifier delivering calibrated probability predictions & decision outputs
• Evaluated across 10 core financial and credit risk features (income, debt, loan grade & history).`,
    icon: CheckSquare,
    tags: ["Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "FastAPI", "Pandas", "NumPy", "HTML5", "CSS3"],
    gradient: "from-emerald-500 to-teal-500",
    github: "https://github.com/Durgesh729/Loan-Approval.git"
  },
  {
    title: "Product Feedback Analysis",
    description: `An automated Natural Language Processing (NLP) system designed to analyze multi-domain e-commerce product reviews across 31 categories, validate input domain relevance, and classify feedback sentiment into Positive, Negative, and Neutral categories using a leakage-free supervised machine learning pipeline:
• Domain Validation Layer filtering non-product input text across 31 product domains
• Preprocessing pipeline with negation-preserving stop-word filtering & lemmatization
• TF-IDF feature extraction with balanced Logistic Regression classifier
• Evaluated on held-out test set of 30,000 multi-domain e-commerce samples.`,
    icon: Smartphone,
    tags: ["NLP", "Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "NLTK", "FastAPI", "Pandas", "NumPy"],
    gradient: "from-blue-500 to-indigo-500",
    github: "https://github.com/Durgesh729/Product-Feedback-Analysis.git"
  },
  {
    title: "Smart Business Analytics",
    description: `An interactive data analytics and business intelligence platform enabling users to upload raw sales datasets and receive real-time visual analytics:
• Automated data ingestion pipeline supporting dynamic sales data uploads
• Interactive visual dashboards built with Matplotlib, Seaborn, and Plotly
• Exploratory data analysis (EDA) identifying sales patterns & revenue trends
• Statistical summary reports and actionable KPI metrics for business decision-making.`,
    icon: BarChart3,
    tags: ["Machine Learning", "Data Science"],
    tech: ["Python", "Scikit-learn", "Numpy", "Pandas", "Matplotlib", "Plotly", "Seaborn"],
    gradient: "from-violet-500 to-purple-500",
    github: "https://github.com/Durgesh729/Smart-Buisiness-Analytics.git"
  }
];

const ProjectsSection = () => {
  const [activeFolderModal, setActiveFolderModal] = useState<"poisoning" | "loan" | "feedback" | "analytics" | null>(null);
  const [portalFolderOpen, setPortalFolderOpen] = useState(false);

  useEffect(() => {
    if (activeFolderModal) {
      setPortalFolderOpen(false);
      const timer = setTimeout(() => {
        setPortalFolderOpen(true);
      }, 60);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    } else {
      setPortalFolderOpen(false);
    }
  }, [activeFolderModal]);

  useEffect(() => {
    if (!activeFolderModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPortalFolderOpen(false);
        setTimeout(() => setActiveFolderModal(null), 260);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeFolderModal]);

  const closeViewer = () => {
    setPortalFolderOpen(false);
    setTimeout(() => setActiveFolderModal(null), 260);
  };

  return (
    <section id="projects" className="projects-section-container pt-24 pb-16 relative overflow-x-clip bg-background">
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
          itemStackDistance={26}
          itemScale={0.03}
          stackPosition="10%"
          dwellDistance={420}
          useWindowScroll={true} // Enable window scrolling
        >
          {projects.map((project, index) => {
            // Custom Folder Card for all projects
            let folderItems = poisoningFolderItems;
            let folderModalKey: "poisoning" | "loan" | "feedback" | "analytics" = "poisoning";

            if (project.title === "Loan Approval") {
              folderItems = loanFolderItems;
              folderModalKey = "loan";
            } else if (project.title.includes("Feedback")) {
              folderItems = feedbackFolderItems;
              folderModalKey = "feedback";
            } else if (project.title === "Smart Business Analytics") {
              folderItems = analyticsFolderItems;
              folderModalKey = "analytics";
            }

            return (
              <ScrollStackItem key={project.title}>
                  <div className="w-full group project-card-item">
                    {/* Top Folder Tab: e.g. "Project 1", "Project 3" */}
                    <div className="flex items-end select-none">
                      <div
                        className="project-tab cursor-pointer relative z-20 px-6 sm:px-8 py-2.5 sm:py-3 rounded-t-2xl bg-card/80 backdrop-blur-xl border-t border-l border-r border-white/15 text-xs sm:text-sm font-semibold tracking-wider text-white/90 flex items-center shadow-lg hover:text-primary transition-colors"
                        data-cursor-target="true"
                      >
                        <span>Project {index + 1}</span>
                        {/* Mask to erase the underlying card's top border beneath the tab */}
                        <div className="absolute -bottom-[2px] left-0 right-0 h-[3px] bg-card/90" />
                      </div>
                    </div>

                    {/* Main Card Body (Glassmorphism preserved, increased height, no orange line, no warning icon) */}
                    <div
                      className="glass-card project-card relative -mt-px rounded-b-2xl rounded-tr-2xl rounded-tl-none border border-white/10 glow-effect overflow-hidden p-6 sm:p-8 min-h-[500px] sm:min-h-[540px] shadow-2xl flex flex-col justify-center"
                      data-project-card={`project-${index + 1}`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch h-full">
                        {/* Left Side: Folder Animation (No gray container box) */}
                        <div className="lg:col-span-5 flex items-center justify-center">
                          <div
                            className="w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center cursor-pointer relative"
                            onClick={() => setActiveFolderModal(folderModalKey)}
                            title="Click to open folder in front"
                          >
                            <Folder
                              className="project-folder cursor-target"
                              mode="book"
                              variant="glass"
                              layout="spread"
                              color="#2b2b30"
                              paperColor="#ffffff"
                              tabPosition="right"
                              openOn="hover"
                              onOpenChange={(nextOpen) => {
                                if (nextOpen) setActiveFolderModal(folderModalKey);
                              }}
                              size={1.65}
                              frost={0.25}
                              tilt={0.9}
                              speed={0.55}
                              bounce={0.4}
                              peek
                              intro={false}
                              draggable={false}
                              theme="dark"
                              label="Proof"
                              items={folderItems}
                            />
                          </div>
                        </div>

                        {/* Right Side: Title + Content of Project + Links Action Box */}
                        <div className="lg:col-span-7 flex flex-col justify-between gap-5">
                          {/* Title (No warning icon, no top line) */}
                          <div className="flex items-center justify-between gap-4">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                              {project.title}
                            </h3>
                          </div>

                          {/* "Content of project" Box */}
                          <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 sm:p-6 flex flex-col justify-between gap-5 flex-1 hover:border-white/20 transition-all">
                            <div>
                              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                                {project.description}
                              </p>
                            </div>

                            {/* Tags and Tech Stack */}
                            <div className="space-y-3 pt-2">
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-white/[0.06] text-white/80 border border-white/10"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Links Action Box */}
                          <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-4 flex items-center justify-end gap-6 hover:border-white/20 transition-all">
                            {/* GitHub Button with Hover Tooltip (scoped to group/github) */}
                            <div className="group/github relative flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
                                className="focus:outline-none flex items-center justify-center cursor-pointer p-1"
                                aria-label="GitHub Repository"
                                data-cursor-target="true"
                              >
                                <svg
                                  strokeLinejoin="round"
                                  strokeLinecap="round"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="w-8 h-8 text-white hover:scale-125 duration-200 hover:stroke-blue-500 transition-transform"
                                >
                                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                              </button>
                              <span className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-bottom scale-0 px-3 py-1 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover/github:scale-100 whitespace-nowrap pointer-events-none">
                                GitHub
                              </span>
                            </div>

                            {/* Live Cyber Button */}
                            <button
                              type="button"
                              className="live-btn cursor-pointer"
                              data-cursor-target="true"
                              onClick={() => {
                                if (project.demo) {
                                  window.open(project.demo, "_blank", "noopener,noreferrer");
                                }
                              }}
                            >
                              <span>L i v e</span>
                              <div className="top"></div>
                              <div className="left"></div>
                              <div className="bottom"></div>
                              <div className="right"></div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollStackItem>
              );
          })}
        </ScrollStack>
      </div>

      {/* Popout Front-View Folder Viewer (Card remains in background) */}
      {activeFolderModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-300 select-none cursor-pointer"
            data-exclude-cursor="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeViewer();
              }
            }}
          >
            {/* Front Stage Container */}
            <div
              className="w-full max-w-5xl h-[75vh] max-h-[720px] flex items-center justify-center relative"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closeViewer();
                }
              }}
            >
              <Folder
                key={activeFolderModal}
                mode="book"
                variant="glass"
                layout="spread"
                color="#2b2b30"
                paperColor="#ffffff"
                tabPosition="right"
                openOn="click"
                open={portalFolderOpen}
                onOpenChange={(nextOpen) => {
                  if (!nextOpen) {
                    closeViewer();
                  }
                }}
                size={1.45}
                frost={0.25}
                tilt={0.9}
                speed={0.65}
                bounce={0.4}
                peek={false}
                intro={false}
                draggable
                zoomOnClick
                theme="dark"
                label="Proof"
                items={
                  activeFolderModal === "poisoning"
                    ? poisoningFolderItems
                    : activeFolderModal === "loan"
                    ? loanFolderItems
                    : activeFolderModal === "feedback"
                    ? feedbackFolderItems
                    : analyticsFolderItems
                }
              />
            </div>

            {/* Bottom Interaction Guide */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none text-center">
              <span className="text-[12px] text-white/60 font-medium tracking-wider uppercase bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg">
                Click photo to zoom · Drag documents · Click outside or ESC to close
              </span>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default ProjectsSection;
