import React from 'react';
import { Camera, SwitchCamera } from 'lucide-react';

interface CameraControlsProps {
  isFaceDetected: boolean;
  hasMultipleDevices: boolean;
  onCapture: () => void;
  onSwitchCamera: () => void;
  showControls: boolean;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isFaceDetected,
  hasMultipleDevices,
  onCapture,
  onSwitchCamera,
  showControls
}) => {
  if (!showControls) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 pb-8">
      <div className="relative flex items-center justify-center">
        {isFaceDetected && (
          <button
            onClick={onCapture}
            className="flex items-center justify-center bg-emerald-400/20 hover:bg-emerald-400/30 
                     text-emerald-400 w-20 h-20 rounded-full backdrop-blur-sm transition-all 
                     duration-200 border-2 border-emerald-400/30 transform hover:scale-105"
          >
            <Camera className="w-10 h-10" />
          </button>
        )}

        {hasMultipleDevices && (
          <button
            onClick={onSwitchCamera}
            className="absolute right-8 bottom-0 flex items-center justify-center
                     bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-400
                     w-12 h-12 rounded-full backdrop-blur-sm transition-all duration-200
                     border-2 border-emerald-400/30"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraControls;