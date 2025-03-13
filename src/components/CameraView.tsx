import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCw, Image as ImageIcon } from 'lucide-react';
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

  // Start camera with selected device
  const startCamera = async () => {
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    try {
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
      console.error('Error accessing camera:', err);
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

  const handleCameraChange = (deviceId: string) => {
    updateSettings({ selectedDeviceId: deviceId });
  };

  const handleRefreshCameras = async () => {
    await refreshCameras();
  };

  // Function to navigate to gallery tab
  const navigateToGallery = () => {
    // Find the gallery tab trigger and click it
    const galleryTab = document.querySelector('[value="gallery"]') as HTMLElement;
    if (galleryTab) {
      galleryTab.click();
    }
  };

  return (
    <div className="flex flex-col">
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

      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {!showPreview ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
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
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="mt-4 space-y-3">
        {/* Always visible filename input */}
        <div>
          <FileNameInput 
            value={fileName} 
            onChange={(value) => {
              setFileName(value);
              setFileNameError(null);
            }} 
            placeholder="Dateiname eingeben (optional)"
          />
          {fileNameError && (
            <p className="text-red-500 text-sm mt-1">{fileNameError}</p>
          )}
        </div>
        
        {!showPreview ? (
          <button
            onClick={captureImage}
            className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center"
            disabled={!cameraSettings.selectedDeviceId}
          >
            <Camera className="mr-2" size={20} />
            Foto aufnehmen
          </button>
        ) : (
          <button
            onClick={saveImage}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Speichern
          </button>
        )}
      </div>

      {/* Recent Photos Section */}
      {recentImages.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Letzte Aufnahmen</h3>
            <button 
              onClick={navigateToGallery}
              className="text-blue-600 flex items-center text-sm"
            >
              Alle anzeigen <ImageIcon size={16} className="ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {recentImages.map((image) => (
              <div key={image.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.name} 
                  className="w-full h-full object-cover"
                  onClick={navigateToGallery}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraView;
