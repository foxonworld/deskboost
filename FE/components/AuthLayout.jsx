import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <>
      <style>{`
        @keyframes glow-drift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-glow-drift {
          animation: glow-drift 15s ease-in-out infinite alternate;
        }
        .animate-glow-drift-reverse {
          animation: glow-drift 20s ease-in-out infinite alternate-reverse;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-drift, .animate-glow-drift-reverse { animation: none !important; transform: none !important; }
          .animate-fade-in-up { animation-duration: 0.01ms !important; filter: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      
      {/* Root wrapper uses min-h-[100dvh] for mobile browsers and prevents horizontal scroll */}
      <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-[#0A1810] font-display flex flex-col justify-center items-center p-4 py-8 sm:p-6 lg:p-8 z-10">
        
        {/* Background elements */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(76,175,80,0.15),_transparent_50%)] pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(76,175,80,0.1),_transparent_40%)] pointer-events-none -z-10" />
        
        {/* Soft glowing orbs */}
        <div className="fixed -left-[10%] top-[10%] h-[60vw] max-h-[800px] w-[60vw] max-w-[800px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-60 animate-glow-drift pointer-events-none -z-10" />
        <div className="fixed right-[5%] bottom-[-10%] h-[50vw] max-h-[600px] w-[50vw] max-w-[600px] rounded-full bg-emerald-500/10 blur-[100px] mix-blend-screen opacity-50 animate-glow-drift-reverse pointer-events-none -z-10" />

        {/* Noise texture for filmic feel */}
        <div className="fixed inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay -z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        {/* Centered Layout Container */}
        <div className="relative z-20 w-full max-w-[420px] mx-auto animate-fade-in-up flex flex-col items-center">
          
          {/* Centered Desktop Branding (also shows on mobile but styled slightly differently) */}
          <div className="flex flex-col items-center text-center space-y-4 mb-6 sm:mb-8 px-4">
            <Link to="/" className="inline-flex items-center justify-center rounded-[1.25rem] bg-white/10 p-3 sm:p-4 border border-white/20 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-white text-4xl sm:text-5xl">potted_plant</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">{title}</h1>
            <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed max-w-sm drop-shadow-sm">{subtitle}</p>
          </div>

          {/* Liquid-glass container */}
          <div className="w-full relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/85 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#111813]/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            {/* Inner highlight (subtle top border inset) */}
            <div className="absolute inset-0 rounded-[2rem] border border-white/50 pointer-events-none mix-blend-overlay dark:border-white/20" />
            
            <div className="relative z-10 flex flex-col pt-6 sm:pt-8 pb-4">
              {children}
            </div>
          </div>
        </div>
        
        {/* Fix floating buttons overlapping the form */}
        <div className="h-16 sm:h-0 flex-shrink-0 w-full" />
      </div>
    </>
  );
};

export default AuthLayout;
