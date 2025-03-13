import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw, Image as ImageIcon, X } from 'lucide-react';
import { useCamera } from '../contexts/CameraContext';
import { useGallery } from '../contexts/GalleryContext';
import FileNameInput from './FileNameInput';

const CameraView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fileName, setFileName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [fileNameError, setFileNameError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const { cameraSettings, updateSettings, availableCameras, refreshCameras } = useCamera();
  const { images, addImage } = useGallery();

  // Get only the most recent 4 images for the recent photos section
  const recentImages = images.slice(0, 4);

  const saveImage = () => {
    if (capturedImage) {
      const trimmedFileName = fileName.trim();
      
      if (trimmedFileName && !isFileNameUnique(trimmedFileName)) {
        setFileNameError('Ein Bild mit diesem Namen existiert bereits');
        return;
      }
      
      const name = trimmedFileName || `image_${new Date().toISOString().replace(/:/g, '-')}`;
      addImage({
        id: Date.now().toString(),
        name: name,
        src: capturedImage,
        timestamp: new Date().toISOString(),
      });
      
      // Reset
      setCapturedImage(null);
      setShowPreview(false);
      setFileNameError(null);
      
      // Reset filename only if it was auto-generated
      if (trimmedFileName === '') {
        setFileName('');
      }
    }
  };

  const discardImage = () => {
    setCapturedImage(null);
    setShowPreview(false);
    setFileNameError(null);
  };

  // Navigate to gallery tab
  const navigateToGallery = () => {
    const galleryTab = document.querySelector('[value="gallery"]') as HTMLElement;
    if (galleryTab) {
      galleryTab.click();
    }
  };

  // Check if filename already exists
  const isFileNameUnique = (name: string) => {
    if (!name.trim()) return true; // Empty names will get auto-generated
    return !images.some(image => image.name.toLowerCase() === name.toLowerCase());
  };

  const captureImage = () => {
    // First check if the filename is unique or empty
    const trimmedFileName = fileName.trim();
    
    if (trimmedFileName && !isFileNameUnique(trimmedFileName)) {
      setFileNameError('Ein Bild mit diesem Namen existiert bereits');
      return;
    }
    
    setFileNameError(null);
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Apply filters based on settings
        if (cameraSettings.filter === 'grayscale') {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg;
            data[i + 1] = avg;
            data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
        }
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', cameraSettings.quality / 100);
        
        // If filename is unique or empty, save immediately
        if (trimmedFileName === '' || isFileNameUnique(trimmedFileName)) {
          const name = trimmedFileName || `image_${new Date().toISOString().replace(/:/g, '-')}`;
          addImage({
            id: Date.now().toString(),
            name: name,
            src: imageDataUrl,
            timestamp: new Date().toISOString(),
          });
          
          // Reset filename only if it was auto-generated
          if (trimmedFileName === '') {
            setFileName('');
          }
        } else {
          // Show preview if there was an error (shouldn't happen due to earlier check)
          setCapturedImage(imageDataUrl);
          setShowPreview(true);
        }
      }
    }
  };

  const startCamera = async () => {
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported in this browser');
        alert('Ihr Browser unterstützt keine Kamerafunktionen. Bitte verwenden Sie einen modernen Browser.');
        return;
      }

      // Explicit user permission request
      const permissionResult = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionResult.state === 'denied') {
        alert('Kamera-Berechtigung wurde blockiert. Bitte überprüfen Sie Ihre Browsereinstellungen.');
        return;
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: cameraSettings.selectedDeviceId ? { exact: cameraSettings.selectedDeviceId } : undefined,
          width: { ideal: cameraSettings.resolution.width },
          height: { ideal: cameraSettings.resolution.height }
        }
      });
      
      setStream(newStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Detailed camera access error:', err);
      
      // More specific error handling
      if (err instanceof DOMException) {
        switch (err.name) {
          case 'NotAllowedError':
            alert('Kamerazugriff wurde verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen.');
            break;
          case 'NotFoundError':
            alert('Keine Kamera gefunden. Bitte schließen Sie eine Kamera an oder wählen Sie eine andere.');
            break;
          case 'OverconstrainedError':
            alert('Die angeforderten Kameraeinstellungen werden nicht unterstützt.');
            break;
          default:
            alert('Ein unerwarteter Fehler beim Kamerazugriff ist aufgetreten.');
        }
      }
    }
  };

  // Start camera when component mounts or when camera settings change
  useEffect(() => {
    startCamera();
    
    // Cleanup function to stop the stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraSettings.selectedDeviceId, cameraSettings.resolution]);

  const handleCameraChange = (deviceId: string) => {
    updateSettings({ selectedDeviceId: deviceId });
  };

  const handleRefreshCameras = async () => {
    await refreshCameras();
  };

  return (
    <div className="flex flex-col">
      {/* Main container with two-column layout */}
      <div className="flex w-full h-[500px]">
        {/* Left column: Camera View */}
        <div className="w-1/2 pr-4">
          <div className="w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            {!showPreview ? (
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full">
                <img 
                  src={capturedImage || ''} 
                  alt="Captured" 
                  className="w-full h-full object-contain" 
                />
                <button 
                  onClick={discardImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Camera Controls */}
        <div className="w-1/2 pl-4 flex flex-col">
          {/* Camera selection dropdown */}
          <div className="mb-4 flex items-center">
            <select
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg mr-2"
              value={cameraSettings.selectedDeviceId || ''}
              onChange={(e) => handleCameraChange(e.target.value)}
            >
              {availableCameras.length === 0 ? (
                <option value="">Keine Kamera gefunden</option>
              ) : (
                availableCameras.map((camera) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={handleRefreshCameras}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              title="Kameraliste aktualisieren"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          {/* Filename Input */}
          <FileNameInput 
            value={fileName}
            onChange={(value) => {
              setFileName(value);
              setFileNameError(null);
            }}
            onEnter={!showPreview && cameraSettings.selectedDeviceId ? captureImage : undefined}
            placeholder="Dateiname eingeben (optional)"
          />
          {fileNameError && (
            <p className="text-red-500 text-sm mt-1">{fileNameError}</p>
          )}
          
          {!showPreview ? (
            <button
              onClick={captureImage}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              disabled={!cameraSettings.selectedDeviceId}
            >
              <Camera size={24} className="mr-2" /> Foto aufnehmen
            </button>
          ) : (
            <button
              onClick={saveImage}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg"
            >
              Speichern
            </button>
          )}
        </div>
      </div>

      {/* Recent Photos Section */}
      {recentImages.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Letzte Fotos</h3>
            <button 
              onClick={navigateToGallery}
              className="text-blue-600 flex items-center text-sm"
            >
              Alle anzeigen <ImageIcon size={16} className="ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {recentImages.map((image) => (
              <div 
                key={image.id} 
                className="bg-gray-100 rounded-lg overflow-hidden shadow-md"
              >
                <img 
                  src={image.src} 
                  alt={image.name} 
                  className="w-full h-40 object-cover"
                  onClick={navigateToGallery}
                />
                <div className="p-2 text-center text-sm truncate">
                  {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hidden Canvas for Image Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
