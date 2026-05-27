import React from 'react';
import { Terminal, Zap, Camera, Play } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const PixelPacman = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className={`w-12 h-12 fill-[#ffff00] drop-shadow-[4px_4px_0_#ff007f] ${className || ''}`} style={{ imageRendering: 'pixelated' }}>
    <path className="animate-chomp-open" d="M4 0h6v1h2v1h1v3h1v1H8v2h6v1h-1v3h-1v1h-2v1H4v-1H2v-1H1v-3H0V6h1V3h1V1h2V0z"/>
    <path className="animate-chomp-closed" d="M4 0 h6 v1 h2 v1 h1 v2 h1 v6 h-1 v2 h-1 v1 h-2 v1 h-6 v-1 h-2 v-1 h-1 v-2 h-1 v-6 h1 v-2 h1 v-1 h2 v-1 z"/>
  </svg>
);

const PixelGhost = ({ color, direction, className }: { color: string, direction: 'left' | 'right', className?: string }) => {
  const pupilPath = direction === 'right' 
    ? "M4 5h2v2H4z M10 5h2v2H10z" 
    : "M2 5h2v2H2z M8 5h2v2H8z"; 
  
  const eyePath = direction === 'right'
    ? "M3 3h3v4H3z M9 3h3v4H9z"
    : "M2 3h3v4H2z M8 3h3v4H8z";
    
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" className={`w-12 h-12 drop-shadow-[4px_4px_0_#00ff41] ${className || ''}`} style={{ imageRendering: 'pixelated' }}>
      <path fill={color} d="M5 0h4v1h2v1h1v2h1v10h-2v-2h-1v2h-2v-2h-2v2h-2v-2h-1v2H1V4h1V2h1V1h2V0z"/>
      <path fill="#fff" d={eyePath}/>
      <path fill="#0000ff" d={pupilPath}/>
    </svg>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full min-h-screen bg-brutalDark text-brutalLight font-mono overflow-x-hidden selection:bg-neonPink selection:text-brutalDark">
      {/* Grid Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#00ff41 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Pacman Animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 mix-blend-screen">
         <div className="pacman-path pacman-1 flex gap-4 items-center w-max">
            <PixelGhost color="#ff0000" direction="right" />
            <PixelPacman />
         </div>
         <div className="pacman-path pacman-2 flex gap-4 items-center w-max">
            <PixelPacman className="scale-x-[-1]" />
            <PixelGhost color="#00ffff" direction="left" />
         </div>
      </div>
      
      {/* Marquee Header */}
      <div className="w-full bg-neonPink text-brutalDark font-display font-bold text-xl md:text-2xl uppercase overflow-hidden whitespace-nowrap border-b-4 border-brutalLight py-3 z-10 relative shadow-[0_4px_0_#00ff41]">
        <div className="animate-marquee inline-block">
          &nbsp;⚡ ASCII STUDIO ⚡ BRUTALIST EDITION ⚡ REAL-TIME RENDER ⚡ NO API REQUIRED ⚡ CLIENT-SIDE ONLY
          &nbsp;⚡ ASCII STUDIO ⚡ BRUTALIST EDITION ⚡ REAL-TIME RENDER ⚡ NO API REQUIRED ⚡ CLIENT-SIDE ONLY
          &nbsp;⚡ ASCII STUDIO ⚡ BRUTALIST EDITION ⚡ REAL-TIME RENDER ⚡ NO API REQUIRED ⚡ CLIENT-SIDE ONLY
          &nbsp;⚡ ASCII STUDIO ⚡ BRUTALIST EDITION ⚡ REAL-TIME RENDER ⚡ NO API REQUIRED ⚡ CLIENT-SIDE ONLY
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-24 relative z-10">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-32">
          <div className="relative mb-8">
            <Terminal className="w-32 h-32 text-neonGreen glitch-effect relative z-10 bg-brutalDark p-4 brutalist-border" />
            <div className="absolute inset-0 bg-neonPink blur-xl opacity-30"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black uppercase tracking-tighter mb-6 text-white drop-shadow-[6px_6px_0_#00ff41] hover:drop-shadow-[6px_6px_0_#ff007f] transition-all cursor-default relative z-20">
            ASCII STUDIO
          </h1>
          <p className="text-xl md:text-2xl text-brutalGray font-bold uppercase mb-16 max-w-2xl border-x-8 border-neonGreen px-6 py-2 bg-brutalDark/80">
            Convert reality into pure retro text in real-time.
          </p>
          
          <button 
            onClick={onStart}
            className="brutalist-button text-3xl font-display font-black uppercase px-16 py-6 bg-neonGreen text-brutalDark hover:bg-brutalLight hover:scale-105 transition-all shadow-[8px_8px_0_#ff007f] hover:shadow-[12px_12px_0_#ff007f] active:shadow-[4px_4px_0_#ff007f] active:translate-x-1 active:translate-y-1"
          >
            GET STARTED
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="brutalist-box bg-brutalDark p-8 hover:-translate-y-2 hover:border-neonPink transition-all group">
            <Zap className="w-12 h-12 text-neonPink mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold uppercase mb-4 text-white">Blazing Fast</h3>
            <p className="text-brutalGray text-lg leading-relaxed">Zero latency native processing. Runs entirely locally in your browser without sacrificing quality.</p>
          </div>
          
          <div className="brutalist-box bg-brutalDark p-8 hover:-translate-y-2 hover:border-neonGreen transition-all group shadow-[4px_4px_0_#00ff41]">
            <Camera className="w-12 h-12 text-neonGreen mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold uppercase mb-4 text-white">Dual Color</h3>
            <p className="text-brutalGray text-lg leading-relaxed">Dynamic luminance thresholding separates your silhouette from the background in real-time.</p>
          </div>

          <div className="brutalist-box bg-brutalDark p-8 hover:-translate-y-2 hover:border-white transition-all group">
            <Play className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold uppercase mb-4 text-white">Boomerang</h3>
            <p className="text-brutalGray text-lg leading-relaxed">Capture hyper-lapse looping ASCII videos and download them instantly in full motion.</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full border-t-4 border-brutalLight p-8 text-center text-brutalGray font-bold uppercase bg-brutalDark z-10 relative flex flex-col md:flex-row justify-center gap-4 md:gap-12 text-sm tracking-widest">
        <span>Built for the Retro Web</span>
        <span className="hidden md:inline text-neonPink">•</span>
        <span>Client-Side Only</span>
        <span className="hidden md:inline text-neonPink">•</span>
        <span>Y2K Aesthetic</span>
      </footer>
    </div>
  );
};
