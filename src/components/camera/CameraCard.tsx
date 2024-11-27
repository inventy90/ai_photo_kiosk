import React from 'react';
import Webcam from 'react-webcam';
import { SwitchCamera } from 'lucide-react';

interface CameraCardProps {
  webcamRef: React.RefObject<Webcam>;
  deviceId: string;
  showContent: boolean;
  hasMultipleDevices: boolean;
  onSwitchCamera: () => void;
}

const CameraCard: React.FC<CameraCardProps> = ({
  webcamRef,
  deviceId,
  showContent,
  hasMultipleDevices,
  onSwitchCamera,
}) => {
  return (
    <div className="relative w-full max-w-md aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-400/20">
      <div className={`relative w-full h-full transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          mirrored={true}
          videoConstraints={{
            deviceId,
            width: 720,
            height: 960,
            facingMode: "user"
          }}
          className="w-full h-full object-cover"
          style={{
            transform: 'scale(1.2)',
            transformOrigin: 'center center'
          }}
        />
        
        {hasMultipleDevices && (
          <button
            onClick={onSwitchCamera}
            className="absolute top-4 right-4 flex items-center justify-center
                     bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-400
                     w-12 h-12 rounded-full backdrop-blur-sm transition-all duration-200
                     border-2 border-emerald-400/30"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 border-4 border-emerald-400/10 rounded-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default CameraCard;