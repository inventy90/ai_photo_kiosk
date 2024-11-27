import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import IdleScreen from './IdleScreen';
import CountdownTimer from './CountdownTimer';
import ImagePreview from './ImagePreview';
import Background from './Background';
import CameraCard from './camera/CameraCard';
import CaptureButton from './camera/CaptureButton';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useDevices } from '../hooks/useDevices';

const WebcamWidget = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const countdownInterval = useRef<number>();

  const { devices, currentDeviceId, switchCamera } = useDevices();
  const { isFaceDetected, showIdleScreen } = useFaceDetection(webcamRef);

  const startCapture = useCallback(() => {
    if (isCapturing) return;
    setIsCapturing(true);
    setCountdown(5);

    countdownInterval.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current);
          const imageSrc = webcamRef.current?.getScreenshot();
          if (imageSrc) {
            setCapturedImage(imageSrc);
          }
          setIsCapturing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isCapturing]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  useEffect(() => {
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  return (
    <Background>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="relative flex flex-col items-center">
          {/* Camera card */}
          <div className="relative">
            {devices.length > 0 ? (
              <CameraCard
                webcamRef={webcamRef}
                deviceId={currentDeviceId}
                showContent={!showIdleScreen}
                hasMultipleDevices={devices.length > 1}
                onSwitchCamera={switchCamera}
              />
            ) : (
              <div className="w-full max-w-md aspect-[3/4] flex items-center justify-center bg-gray-900 rounded-3xl">
                <div className="text-center text-emerald-400">
                  <p className="text-xl">No camera detected</p>
                </div>
              </div>
            )}
          </div>

          {/* Capture button - positioned below the card */}
          <div className="relative -mt-10 z-10">
            <CaptureButton
              onClick={startCapture}
              visible={!showIdleScreen && isFaceDetected && !capturedImage}
            />
          </div>
        </div>

        {/* Overlays */}
        {showIdleScreen && (
          <div className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm transition-opacity duration-500">
            <IdleScreen />
          </div>
        )}

        {isCapturing && countdown > 0 && (
          <CountdownTimer seconds={countdown} />
        )}

        {capturedImage && (
          <ImagePreview 
            imageSrc={capturedImage}
            onRetake={handleRetake}
          />
        )}
      </div>
    </Background>
  );
};

export default WebcamWidget;