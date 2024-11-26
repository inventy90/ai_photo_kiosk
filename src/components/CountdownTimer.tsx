import React from 'react';

interface CountdownTimerProps {
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="w-48 h-48 flex items-center justify-center">
        <span className="text-9xl font-bold text-white animate-pulse">
          {seconds}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;