import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProcessingOverlayProps {
  status: string;
}

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ status }) => {
  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 px-8 py-6 bg-white/5 rounded-2xl backdrop-blur-sm border-2 border-white/10">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
        <p className="text-white text-2xl">{status}</p>
      </div>
    </div>
  );
};

export default ProcessingOverlay;