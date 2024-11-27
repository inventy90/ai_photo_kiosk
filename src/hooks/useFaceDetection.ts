import { useState, useEffect, useRef, RefObject } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import Webcam from 'react-webcam';

export const useFaceDetection = (webcamRef: RefObject<Webcam>) => {
  const [detector, setDetector] = useState<faceDetection.FaceDetector | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState(true); // Start with true
  const [showIdleScreen, setShowIdleScreen] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  
  const faceCheckInterval = useRef<number>();
  const lastFaceDetectionTime = useRef<number>(Date.now());

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.setBackend('webgl');
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detector = await faceDetection.createDetector(model, {
          runtime: 'tfjs',
          maxFaces: 1,
        });
        setDetector(detector);
        setIsModelLoaded(true);
      } catch (error) {
        console.error('Error loading face detection model:', error);
        // Keep isFaceDetected true even if model fails to load
      }
    };
    loadModel();
  }, []);

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
        // Keep the current state on error
      }
    };

    faceCheckInterval.current = window.setInterval(checkForFace, 1000);

    return () => {
      if (faceCheckInterval.current) {
        clearInterval(faceCheckInterval.current);
      }
    };
  }, [isModelLoaded, detector]);

  return { isFaceDetected, showIdleScreen, isModelLoaded };
};