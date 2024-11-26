import React, { useState, useCallback, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { SwitchCamera, CameraOff, Camera } from 'lucide-react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import IdleScreen from './IdleScreen';
import CountdownTimer from './CountdownTimer';
import ImagePreview from './ImagePreview';

const WebcamWidget = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');
  const [detector, setDetector] = useState<faceDetection.FaceDetector | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(false);
  const [showIdleScreen, setShowIdleScreen] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const faceCheckInterval = useRef<number>();
  const lastFaceDetectionTime = useRef<number>(Date.now());
  const countdownInterval = useRef<number>();

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
      const detector = await faceDetection.createDetector(model, {
        runtime: 'tfjs',
        maxFaces: 1,
      });
      setDetector(detector);
      setIsModelLoaded(true);
    };
    loadModel();
  }, []);

  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
    setDevices(videoDevices);
    if (videoDevices.length > 0 && !currentDeviceId) {
      setCurrentDeviceId(videoDevices[0].deviceId);
    }
  }, [currentDeviceId]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(handleDevices)
      .catch(err => console.error("Error accessing camera devices:", err));
  }, [handleDevices]);

  useEffect(() => {
    if (!isModelLoaded || !detector || !webcamRef.current?.video) return;

    const checkForFace = async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) return;

      try {
        const faces = await detector.estimateFaces(video);
        
        if (faces.length > 0) {
          lastFaceDetectionTime.current = Date.now();
          setIsFaceDetected(true);
          setShowIdleScreen(false);
        } else {
          setIsFaceDetected(false);
          const timeSinceLastFace = Date.now() - lastFaceDetectionTime.current;
          if (timeSinceLastFace > 5000) {
            setShowIdleScreen(true);
          }
        }
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    faceCheckInterval.current = window.setInterval(checkForFace, 1000);

    return () => {
      if (faceCheckInterval.current) {
        clearInterval(faceCheckInterval.current);
      }
    };
  }, [isModelLoaded, detector]);

  const switchCamera = useCallback(() => {
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setCurrentDeviceId(devices[nextIndex].deviceId);
  }, [currentDeviceId, devices]);

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
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-gray-900">
        {devices.length > 0 ? (
          <>
            <div className={`relative w-full h-full transition-opacity duration-500 ${showIdleScreen ? 'opacity-0' : 'opacity-100'}`}>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  deviceId: currentDeviceId,
                  width: 1920,
                  height: 1080,
                }}
                className="w-full h-full object-cover"
              />
              {isFaceDetected && (
                <div className="absolute top-8 left-8 bg-green-500/20 text-white px-6 py-3 rounded-xl backdrop-blur-sm border border-green-500/30">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    Face Detected
                  </span>
                </div>
              )}
            </div>
            {showIdleScreen && (
              <div className="absolute inset-0 transition-opacity duration-500">
                <IdleScreen />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <CameraOff className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-3xl">No camera detected</p>
            </div>
          </div>
        )}
      </div>
      
      {devices.length > 0 && !showIdleScreen && !capturedImage && (
        <>
          <button
            onClick={startCapture}
            disabled={isCapturing}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center
                     bg-white/10 hover:bg-white/20 text-white 
                     w-20 h-20 rounded-full backdrop-blur-sm 
                     transition-all duration-200
                     shadow-lg hover:shadow-xl border-2 border-white/20"
          >
            <Camera className="w-10 h-10" />
          </button>

          {devices.length > 1 && (
            <button
              onClick={switchCamera}
              className="absolute bottom-8 right-8 flex items-center gap-3 
                       bg-black/50 hover:bg-black/70 text-white 
                       px-8 py-6 rounded-2xl backdrop-blur-sm 
                       transition-all duration-200 text-2xl 
                       shadow-lg hover:shadow-xl border-2 border-white/20"
            >
              <SwitchCamera className="w-10 h-10" />
              <span>Switch Camera</span>
            </button>
          )}
        </>
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
  );
};

export default WebcamWidget;