import React from 'react';
import WavingLines from './background/WavingLines';
import GradientBlobs from './background/GradientBlobs';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-gray-800 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <WavingLines />
        <GradientBlobs />
        
        {/* Interactive hover effect */}
        <div className="absolute inset-0 opacity-0 hover:opacity-10 transition-opacity duration-500">
          <div className="w-full h-full bg-gradient-to-br from-emerald-400/20 to-transparent" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;