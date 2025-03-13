import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Resolution {
  width: number;
  height: number;
}

interface CameraDevice {
  deviceId: string;
  label: string;
}

interface CameraSettings {
  resolution: Resolution;
  filter: 'none' | 'grayscale';
  quality: number;
  selectedDeviceId: string | null;
}

interface CameraContextType {
  cameraSettings: CameraSettings;
  updateSettings: (settings: Partial<CameraSettings>) => void;
  availableCameras: CameraDevice[];
  refreshCameras: () => Promise<void>;
}

const defaultSettings: CameraSettings = {
  resolution: { width: 1280, height: 720 },
  filter: 'none',
  quality: 80,
  selectedDeviceId: null
};

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(defaultSettings);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);

  const refreshCameras = async () => {
    try {
      // Request permission to access media devices
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Get list of available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Kamera ${availableCameras.length + 1}`
        }));
      
      setAvailableCameras(videoDevices);
      
      // If no camera is selected yet and we have cameras available, select the first one
      if (!cameraSettings.selectedDeviceId && videoDevices.length > 0) {
        setCameraSettings(prev => ({
          ...prev,
          selectedDeviceId: videoDevices[0].deviceId
        }));
      }
    } catch (error) {
      console.error('Error accessing camera devices:', error);
    }
  };

  // Initial camera detection
  useEffect(() => {
    refreshCameras();
  }, []);

  const updateSettings = (newSettings: Partial<CameraSettings>) => {
    setCameraSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return (
    <CameraContext.Provider value={{ 
      cameraSettings, 
      updateSettings, 
      availableCameras, 
      refreshCameras 
    }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = (): CameraContextType => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};
