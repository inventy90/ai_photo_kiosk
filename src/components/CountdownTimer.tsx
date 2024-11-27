import React from 'react';

interface CountdownTimerProps {
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
        <div className="relative w-48 h-48 flex items-center justify-center bg-emerald-400/20 rounded-full backdrop-blur-sm border-2 border-emerald-400/30">
          <span className="text-8xl font-bold text-emerald-400">
            {seconds}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;