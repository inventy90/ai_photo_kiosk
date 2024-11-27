import React from 'react';
import { Camera } from 'lucide-react';

interface CaptureButtonProps {
  onClick: () => void;
  visible: boolean;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center bg-emerald-400 hover:bg-emerald-500 
                 text-gray-900 w-20 h-20 rounded-full transition-all duration-200 
                 shadow-lg hover:shadow-emerald-400/20 transform hover:scale-105
                 border-4 border-gray-900"
    >
      <Camera className="w-10 h-10" />
    </button>
  );
};

export default CaptureButton;