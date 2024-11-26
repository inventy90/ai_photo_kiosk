import React, { useState } from 'react';
import { RotateCcw, Wand2 } from 'lucide-react';
import ProcessingOverlay from './ProcessingOverlay';
import { uploadToCloudinary, initiateProcessing, pollResult } from '../services/imageProcessing';

interface ImagePreviewProps {
  imageSrc: string;
  onRetake: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc, onRetake }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      setProcessingStatus('Uploading image...');
      
      const cloudinaryUrl = await uploadToCloudinary(imageSrc);
      
      setProcessingStatus('Initiating AI processing...');
      const requestId = await initiateProcessing(cloudinaryUrl);
      
      setProcessingStatus('Processing image with AI...');
      const result = await pollResult(requestId);
      
      setProcessedImage(result);
      setIsProcessing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setProcessingStatus('Processing failed');
      
      // Reset after error display
      setTimeout(() => {
        setIsProcessing(false);
        setError(null);
      }, 3000);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8">
      <div className="relative w-full max-w-4xl mx-auto">
        <img 
          src={processedImage || imageSrc} 
          alt="Captured" 
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
      </div>
      
      {!processedImage && !isProcessing && (
        <div className="flex flex-col items-center">
          <div className="flex gap-6 mt-8">
            <button
              onClick={onRetake}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white 
                       px-8 py-6 rounded-2xl backdrop-blur-sm transition-all duration-200 
                       text-2xl shadow-lg hover:shadow-xl border-2 border-white/20"
            >
              <RotateCcw className="w-8 h-8" />
              <span>Retake Photo</span>
            </button>
            
            <button
              onClick={handleProcess}
              className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white 
                       px-8 py-6 rounded-2xl transition-all duration-200 
                       text-2xl shadow-lg hover:shadow-xl"
            >
              <Wand2 className="w-8 h-8" />
              <span>Process with AI</span>
            </button>
          </div>
          
          {error && (
            <div className="mt-4 px-6 py-3 bg-red-500/20 text-red-200 rounded-xl backdrop-blur-sm border border-red-500/30">
              {error}
            </div>
          )}
        </div>
      )}

      {processedImage && (
        <button
          onClick={onRetake}
          className="mt-8 flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white 
                   px-8 py-6 rounded-2xl backdrop-blur-sm transition-all duration-200 
                   text-2xl shadow-lg hover:shadow-xl border-2 border-white/20"
        >
          <RotateCcw className="w-8 h-8" />
          <span>Take New Photo</span>
        </button>
      )}

      {isProcessing && <ProcessingOverlay status={processingStatus} />}
    </div>
  );
};

export default ImagePreview;