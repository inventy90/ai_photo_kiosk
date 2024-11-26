import React from 'react';
import { User } from 'lucide-react';

const IdleScreen = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
      <User className="w-32 h-32 mb-8 text-white/50 animate-pulse" />
      <h1 className="text-4xl font-bold mb-4">Waiting for User</h1>
      <p className="text-xl text-gray-400">Please stand in front of the camera</p>
    </div>
  );
};

export default IdleScreen;