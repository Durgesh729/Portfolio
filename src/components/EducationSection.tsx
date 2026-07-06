import { useEffect, useRef } from "react";
import { GraduationCap, Award, Book, Sparkles } from "lucide-react";
import DecryptedText from "./DecryptedText";
import CardSwap, { Card } from './CardSwap';
import { TextShimmer } from '@/components/core/text-shimmer';
import "./EducationSection.css";

const EducationSection = () => {
  const revealCardRef = useRef<HTMLDivElement>(null);
  const hscCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.2 } // Trigger a bit earlier/easier
    );

    if (revealCardRef.current) observer.observe(revealCardRef.current);
    if (hscCardRef.current) observer.observe(hscCardRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" className="pt-10 pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-white mb-4">
            Education
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">
              <DecryptedText
                text="Learning Journey"
                animateOn="view"
                revealDirection="start"
                sequential={true}
                speed={100}
              />
            </span>
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left Column: Education & Skills */}
          <div className="space-y-6">
            <div className="text-center md:text-left mb-8 md:mb-12">
              <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center md:justify-start gap-3">
                <GraduationCap className="text-primary" />
                Education & Certification
                <Award className="text-primary" />
              </h3>
            </div>

            {/* Degree Card (Reveal Animation) */}
            <div ref={revealCardRef} className="reveal-card group relative border border-[#2862d6] hover:border-gray-700 transition-all duration-300 hover:-translate-y-2">
              {/* BACK FACE (Content) */}
              <div className="face back">
                <div className="content">
                  <h3 className="degree">
                    B.E Computer Science Engineering (AI & ML)
                  </h3>
                  <p className="college">
                    Gharda Institute of Technology, India
                  </p>

                  <div className="meta">
                    <span className="badge primary">2023 – 2027</span>
                    <span className="badge secondary">Completed</span>
                  </div>
                </div>
              </div>

              {/* FRONT FACE (Overlay) */}
              <div className="face front">
                <div className="cap-container text-white">
                  <GraduationCap size={64} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* HSC Card (Reveal Animation) */}
            <div ref={hscCardRef} className="reveal-card group relative border border-[#2862d6] hover:border-gray-700 transition-all duration-300 hover:-translate-y-2">
              {/* BACK FACE (Content) */}
              <div className="face back">
                <div className="content">
                  <h3 className="degree">HSC (Science Stream)</h3>
                  <p className="college">Higher Secondary Education</p>
                  <div className="flex gap-3 text-xs font-medium">
                    <span className="px-3 py-1 rounded-full bg-[#2862d6]/10 text-[#2862d6]">2021 – 2023</span>
                    <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400">Completed</span>
                  </div>
                </div>
              </div>

              {/* FRONT FACE (Overlay) */}
              <div className="face front">
                <div className="cap-container text-white">
                  <Book size={64} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Currently Learning Card */}
            <div className="group relative bg-[#0a0f14] border border-[#2862d6] rounded-2xl p-6 shadow-[0_0_30px_-5px_rgba(20,184,166,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-[#2862d6]" size={20} />
                <h3 className="text-lg font-bold text-white">Currently Learning</h3>
              </div>

              <div className="learning-container flex flex-wrap gap-3">
                <div className="card-learning-1 px-4 py-2 rounded-full bg-[#131b24] border border-[#2862d6] text-sm font-medium hover:bg-[#1a242f] transition-colors cursor-default relative overflow-hidden">
                  <button className="button" data-text="Deep Learning">
                    <span className="actual-text">Deep Learning</span>
                    <span aria-hidden="true" className="hover-text">Deep Learning</span>
                  </button>
                </div>
                <div className="card-learning-2 px-4 py-2 rounded-full bg-[#131b24] border border-[#2862d6] text-sm font-medium hover:bg-[#1a242f] transition-colors cursor-default relative overflow-hidden">
                  <button className="button" data-text="TensorFlow">
                    <span className="actual-text">TensorFlow</span>
                    <span aria-hidden="true" className="hover-text">TensorFlow</span>
                  </button>
                </div>
                <div className="card-learning-3 px-4 py-2 rounded-full bg-[#131b24] border border-[#2862d6] text-sm font-medium hover:bg-[#1a242f] transition-colors cursor-default relative overflow-hidden">
                  <button className="button" data-text="Neural Network">
                    <span className="actual-text">Neural Network</span>
                    <span aria-hidden="true" className="hover-text">Neural Network</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Certificate Card Swap */}
          <div className="relative h-[480px] flex items-center justify-center -mt-24 md:mt-0 w-full max-w-[600px] mx-auto">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

            <CardSwap width="100%" height={440} cardDistance={40} verticalDistance={50} delay={4000} skewAmount={3}>

              {/* Card 1: Python */}
              <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="/python-cert.webp"
                    alt="Background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                      ℙ𝕪𝕥𝕙𝕠𝕟 𝕗𝕠𝕣 𝔻𝕒𝕥𝕒 𝕊𝕔𝕚𝕖𝕟𝕔𝕖
                    </TextShimmer>
                  </div>
                </div>
              </Card>

              {/* Card 2: Generative AI */}
              <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl ">
                <div className="absolute inset-0 z-0">
                  <img
                    src="/gen-ai-cert.webp"
                    alt="Background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                      𝔾𝕖𝕟𝕖𝕣𝕒𝕥𝕚𝕧𝕖 𝔸𝕀
                    </TextShimmer>
                    <p className="text-gray-300 font-medium drop-shadow-md">LinkedIn Learning</p>
                  </div>
                </div>
              </Card>

              {/* Card 3: Corizo */}
              <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <img
                    src="/corizo-cert.webp"
                    alt="Background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                      𝕄𝕒𝕔𝕙𝕚𝕟𝕖 𝕃𝕖𝕒𝕣𝕟𝕚𝕟𝕘 𝔹𝕠𝕠𝕥𝕔𝕒𝕞𝕡
                    </TextShimmer>
                    <p className="text-gray-300 font-medium drop-shadow-md">Corizo</p>
                  </div>
                </div>
              </Card>

              {/* Card 4: be10x */}
              <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <img
                    src="/be10x-cert.webp"
                    alt="Background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                      𝔸𝕀 𝕋𝕠𝕠𝕝𝕤 𝕎𝕠𝕣𝕜𝕤𝕙𝕠𝕡
                    </TextShimmer>
                    <p className="text-gray-300 font-medium drop-shadow-md">be10x</p>
                  </div>
                </div>
              </Card>

              {/* Card 5: Teamwork */}
              <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <img
                    src="/teamwork-cert.webp"
                    alt="Background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                      𝕋𝕖𝕒𝕞𝕨𝕠𝕣𝕜 𝔽𝕠𝕦𝕟𝕕𝕒𝕥𝕚𝕠𝕟𝕤
                    </TextShimmer>
                    <p className="text-gray-300 font-medium drop-shadow-md">LinkedIn Learning</p>
                  </div>
                </div>
              </Card>

              {/* Card 6: NxtWave */}
              <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <img
                    src="/nxtwave-cert.webp"
                    alt="Background"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                      𝔹𝕦𝕚𝕝𝕕 𝕐𝕠𝕦𝕣 𝕆𝕨𝕟 𝔾𝕖𝕟𝕖𝕣𝕒𝕥𝕚𝕧𝕖 𝔸𝕀 𝕄𝕠𝕕𝕖𝕝
                    </TextShimmer>
                    <p className="text-gray-300 font-medium drop-shadow-md">NxtWave</p>
                  </div>
                </div>
              </Card>

            </CardSwap>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EducationSection;
