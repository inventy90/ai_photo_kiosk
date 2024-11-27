import React from 'react';
import { Sparkles, Camera, Palette } from 'lucide-react';

const IdleScreen = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute text-emerald-400/30 w-8 h-8
                       animate-[float_${3 + i}s_ease-in-out_infinite]`}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative">
        <h1 className="text-6xl font-bold mb-12 text-emerald-400 leading-tight">
          <span className="block transform hover:scale-105 transition-transform duration-300">
            Create Your
          </span>
          <span className="block bg-gradient-to-r from-emerald-400 to-teal-300 text-transparent bg-clip-text transform hover:scale-105 transition-transform duration-300">
            AI Portrait
          </span>
        </h1>

        {/* Animated icons circle */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <div className="absolute inset-0 bg-emerald-400/10 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {[Camera, Palette, Sparkles].map((Icon, i) => (
                <div
                  key={i}
                  className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 120}deg) translateY(-80px) rotate(${-i * 120}deg)`
                  }}
                >
                  <div className="w-full h-full bg-emerald-400/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
                    <Icon className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subtle instruction */}
        <p className="text-emerald-400/80 text-xl animate-pulse">
          Step into frame to begin
        </p>
      </div>

      {/* Background accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default IdleScreen;