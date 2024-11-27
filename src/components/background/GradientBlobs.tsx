import React from 'react';

const GradientBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main emerald blob */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #34d399 0%, #059669 100%)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite'
        }}
      />

      {/* Secondary yellow blob */}
      <div 
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle at 70% 70%, #fbbf24 0%, #d97706 100%)',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite reverse'
        }}
      />

      {/* Small accent blobs */}
      <div 
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle at center, #34d399 0%, transparent 70%)',
          filter: 'blur(20px)',
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />
    </div>
  );
};

export default GradientBlobs;