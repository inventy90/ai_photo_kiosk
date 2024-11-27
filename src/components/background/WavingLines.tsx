import React from 'react';

const WavingLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Curved animated lines */}
      <div className="absolute -right-1/4 top-0 w-full h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute right-0 w-full h-full border-r-2 border-white/10"
            style={{
              transform: `translateX(${i * 24}px) skewY(-45deg)`,
              transformOrigin: 'top right',
              animation: `wave ${3 + i * 0.2}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Small dots pattern */}
      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              top: `${i * 20}%`,
              right: `${i * 20}%`,
              animation: `pulse ${2 + i * 0.3}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WavingLines;