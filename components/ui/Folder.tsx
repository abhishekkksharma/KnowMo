import React from 'react';

interface GlassFolderProps {
  /** Optional additional classes for the folder container */
  className?: string;
}

const GlassFolder: React.FC<GlassFolderProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-64 h-48 group cursor-pointer ${className}`}>
      
      {/* --- BACK LAYER (Solid Pink) --- */}
      <div className="absolute inset-0 z-10 transition-transform duration-300 ease-in-out group-hover:-translate-y-2">
        {/* Folder Tab */}
        <div className="absolute top-2 left-0 w-28 h-10 bg-pink-400 rounded-tl-2xl rounded-tr-3xl" />
        
        {/* Folder Back Body */}
        <div className="absolute top-7 left-0 w-full h-[calc(100%-1.75rem)] bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl rounded-tl-none shadow-md" />
      </div>
      
      {/* --- FRONT LAYER (Glassmorphism Cover) --- */}
      <div 
        className="absolute -bottom-2 left-0 w-full h-[85%] bg-pink-200/40 backdrop-blur-xl border border-white/60 rounded-2xl shadow-[0_8px_32px_0_rgba(244,114,182,0.3)] z-20 overflow-hidden transition-all duration-300 ease-in-out origin-bottom group-hover:rotate-x-12 group-hover:scale-y-95"
        style={{ transformPerspective: '800px' } as React.CSSProperties}
      >
        {/* Inner Highlight/Shine for realistic glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-white/10 to-transparent opacity-80" />
        
        {/* Bottom frosted shadow overlay to match the original depth */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/40 to-transparent blur-sm" />
      </div>

    </div>
  );
};

export default GlassFolder;