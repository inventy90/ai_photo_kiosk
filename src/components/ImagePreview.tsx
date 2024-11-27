import React, { useState } from 'react';
import { RotateCcw, Wand2, Printer } from 'lucide-react';
import ProcessingOverlay from './ProcessingOverlay';
import { uploadToCloudinary, initiateProcessing, pollResult } from '../services/imageProcessing';
import { printImage } from '../utils/printUtils';

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
      
      setTimeout(() => {
        setIsProcessing(false);
        setError(null);
      }, 3000);
    }
  };

  const handlePrint = () => {
    if (processedImage) {
      printImage(processedImage);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/95 flex items-center justify-center p-8">
      <div className="relative flex flex-col items-center max-w-md w-full">
        {processedImage && (
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-6 py-3 bg-emerald-400/20 rounded-full backdrop-blur-sm border border-emerald-400/30 z-10">
            <p className="text-2xl text-emerald-400 whitespace-nowrap">You look awesome!</p>
          </div>
        )}
        
        <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-400/20">
          <img 
            src={processedImage || imageSrc} 
            alt="Captured" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 border-4 border-emerald-400/10 rounded-3xl pointer-events-none" />
        </div>

        <div className="relative -mt-10 z-10">
          {!processedImage && !isProcessing && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleProcess}
                className="flex items-center justify-center gap-3 bg-emerald-400 hover:bg-emerald-500 
                         text-gray-900 w-auto h-16 px-8 rounded-full transition-all duration-200 
                         shadow-lg hover:shadow-emerald-400/20 transform hover:scale-105
                         border-4 border-gray-900"
              >
                <Wand2 className="w-6 h-6" />
                <span className="text-lg font-semibold">Process with AI</span>
              </button>
              
              <button
                onClick={onRetake}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70
                         px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-200
                         text-base border border-white/10"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Photo</span>
              </button>
            </div>
          )}

          {processedImage && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-3 bg-emerald-400 hover:bg-emerald-500 
                         text-gray-900 w-auto h-16 px-8 rounded-full transition-all duration-200 
                         shadow-lg hover:shadow-emerald-400/20 transform hover:scale-105
                         border-4 border-gray-900"
              >
                <Printer className="w-6 h-6" />
                <span className="text-lg font-semibold">Print Photo</span>
              </button>

              <button
                onClick={onRetake}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70
                         px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-200
                         text-base border border-white/10"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Take New Photo</span>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-500/20 text-red-200 rounded-xl backdrop-blur-sm border border-red-500/30">
            {error}
          </div>
        )}
      </div>

      {isProcessing && (
        <ProcessingOverlay status={processingStatus} />
      )}
    </div>
  );
};

export default ImagePreview;