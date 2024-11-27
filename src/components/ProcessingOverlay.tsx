import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  status: string;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ status }) => {
  return (
    <div className="absolute inset-0 bg-gray-800/95 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
          <div className="relative w-32 h-32 flex items-center justify-center bg-emerald-400/20 rounded-full backdrop-blur-sm border-2 border-emerald-400/30">
            <Loader2 className="w-16 h-16 text-emerald-400 animate-spin" />
          </div>
        </div>
        <p className="text-3xl text-emerald-400 text-center px-8">
          Please be patient,<br />
          the artist is creating<br />
          a masterpiece.
        </p>
        <p className="text-xl text-emerald-400/70">
          {status}
        </p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;