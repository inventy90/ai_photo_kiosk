import { useState, useCallback, useEffect } from 'react';

export const useDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');

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

  const switchCamera = useCallback(() => {
    const currentIndex = devices.findIndex(device => device.deviceId === currentDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    setCurrentDeviceId(devices[nextIndex].deviceId);
  }, [currentDeviceId, devices]);

  return { devices, currentDeviceId, switchCamera };
};