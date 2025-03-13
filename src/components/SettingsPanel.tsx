import React from 'react';
import { useCamera } from '../contexts/CameraContext';

const SettingsPanel: React.FC = () => {
  const { cameraSettings, updateSettings, availableCameras, refreshCameras } = useCamera();

  const resolutionOptions = [
    { label: '640 × 480', value: { width: 640, height: 480 } },
    { label: '1280 × 720', value: { width: 1280, height: 720 } },
    { label: '1920 × 1080', value: { width: 1920, height: 1080 } }
  ];

  const filterOptions = [
    { label: 'Normal', value: 'none' },
    { label: 'Schwarz-Weiß', value: 'grayscale' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Kamera</h3>
        <div className="flex items-center space-x-2">
          <select
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            value={cameraSettings.selectedDeviceId || ''}
            onChange={(e) => updateSettings({ selectedDeviceId: e.target.value })}
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
            onClick={() => refreshCameras()}
            className="px-3 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-lg"
          >
            Aktualisieren
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Auflösung</h3>
        <div className="grid grid-cols-3 gap-3">
          {resolutionOptions.map((option) => (
            <button
              key={option.label}
              className={`py-2 px-3 border rounded-lg ${
                cameraSettings.resolution.width === option.value.width
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => updateSettings({ resolution: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Filter</h3>
        <div className="grid grid-cols-2 gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`py-2 px-3 border rounded-lg ${
                cameraSettings.filter === option.value
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => updateSettings({ filter: option.value })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Qualität</h3>
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Niedrig</span>
          <input
            type="range"
            min="10"
            max="100"
            step="10"
            value={cameraSettings.quality}
            onChange={(e) => updateSettings({ quality: parseInt(e.target.value) })}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="ml-2 text-gray-700">Hoch</span>
        </div>
        <div className="text-center mt-1 text-sm text-gray-500">
          {cameraSettings.quality}%
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
