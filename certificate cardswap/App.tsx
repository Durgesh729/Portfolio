import CardSwap, { Card } from './CardSwap';
import { TextShimmer } from '../src/components/core/text-shimmer';
import { GraduationCap, Book, Sparkles, } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden text-gray-200 p-4 md:p-8 font-['Inter'] flex flex-col items-center justify-center">
      {/* 1. Base Gradient */}
      <div className="absolute inset-0 bg-hero-gradient -z-10" />

      {/* 2. Glow Blobs (Primary & Secondary colors) */}
      {/* Top-Left Blueish Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse-glow -z-[9]" />
      {/* Bottom-Right Purpleish Glow */}
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow animation-delay-500 -z-[9]" />

      {/* 3. Grid Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-[10]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '50px'
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-start relative z-10">

        {/* Left Column: Education & Skills */}
        <div className="space-y-6">

          {/* Degree Card */}
          <div className="group relative bg-[#0f161e] border border-[#2862d6] rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:-translate-y-2">
            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-[#1c252e] flex items-center justify-center text-[#2862d6] shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">B.Tech Computer Science Engineering (AI & ML)</h3>
                <p className="text-gray-400 text-sm mb-3">Gharda Institute of Technology, India</p>
                <div className="flex gap-3 text-xs font-medium">
                  <span className="px-3 py-1 rounded-full bg-[#2862d6]/10 text-[#2862d6]">2023 – 2027</span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400">Third Year – TE</span>
                </div>
              </div>
            </div>
          </div>

          {/* HSC Card */}
          <div className="group relative bg-[#0f161e] border border-[#2862d6] rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:-translate-y-2">
            <div className="flex gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-[#1c252e] flex items-center justify-center text-[#2862d6] shrink-0">
                <Book size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">HSC (Science Stream)</h3>
                <p className="text-gray-400 text-sm mb-3">Higher Secondary Education</p>
                <div className="flex gap-3 text-xs font-medium">
                  <span className="px-3 py-1 rounded-full bg-[#2862d6]/10 text-[#2862d6]">2021 – 2023</span>
                  <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400">Completed</span>
                </div>
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
              <div className="px-4 py-2 rounded-full bg-[#131b24] border border-[#2862d6] text-sm font-medium hover:bg-[#1a242f] transition-colors cursor-default relative overflow-hidden">
                <button className="button" data-text="Deep Learning">
                  <span className="actual-text">Deep Learning</span>
                  <span aria-hidden="true" className="hover-text">Deep Learning</span>
                </button>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#131b24] border border-[#2862d6] text-sm font-medium hover:bg-[#1a242f] transition-colors cursor-default relative overflow-hidden">
                <button className="button" data-text="TensorFlow">
                  <span className="actual-text">TensorFlow</span>
                  <span aria-hidden="true" className="hover-text">TensorFlow</span>
                </button>
              </div>
              <div className="px-4 py-2 rounded-full bg-[#131b24] border border-[#2862d6] text-sm font-medium hover:bg-[#1a242f] transition-colors cursor-default relative overflow-hidden">
                <button className="button" data-text="Neural Network">
                  <span className="actual-text">Neural Network</span>
                  <span aria-hidden="true" className="hover-text">Neural Network</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Certificate Card Swap */}
        <div className="relative h-[480px] flex items-center justify-center -mt-24 md:-mt-28 w-full max-w-[600px] mx-auto">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

          <CardSwap width="100%" height={440} cardDistance={40} verticalDistance={50} delay={4000} skewAmount={3}>

            {/* Card 1: Python */}
            <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              {/* Background Image & Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/python-cert.png"
                  alt="Background"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Header elements removed as requested */}
                <div>
                  <TextShimmer className='text-xl font-bold bg-[linear-gradient(110deg,#9ca3af_25%,#ffffff_50%,#9ca3af_75%)] mb-1 drop-shadow-md' as='h4'>
                    ℙ𝕪𝕥𝕙𝕠𝕟 𝕗𝕠𝕣 𝔻𝕒𝕥𝕒 𝕊𝕔𝕚𝕖𝕟𝕔𝕖
                  </TextShimmer>
                  <p className="text-gray-300 font-medium drop-shadow-md"></p>
                </div>
              </div>
            </Card>

            {/* Card 2: Generative AI */}
            <Card className="!rounded-none bg-[#131b24] border border-gray-800 p-6 flex flex-col justify-between shadow-2xl ">
              <div className="absolute inset-0 z-0">
                <img
                  src="/gen-ai-cert.jpg"
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
                  src="/corizo-cert.png"
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
                  src="/be10x-cert.png"
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
                  src="/teamwork-cert.jpg"
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
                  src="/nxtwave-cert.png"
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
  );
}

export default App;
