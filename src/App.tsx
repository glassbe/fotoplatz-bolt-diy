import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Camera, Settings, Image as ImageIcon } from 'lucide-react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import Gallery from './components/Gallery';
import SettingsPanel from './components/SettingsPanel';
import { CameraProvider } from './contexts/CameraContext';
import { GalleryProvider } from './contexts/GalleryContext';
import ToastContainer, { ToastMessage } from './components/ToastContainer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('camera');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <CameraProvider>
      <GalleryProvider>
        <div className="min-h-screen bg-gray-100">
          <Header />
          
          <main className="container mx-auto px-4 py-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="camera" className="flex items-center">
                  <Camera className="mr-2" size={18} />
                  Kamera
                </TabsTrigger>
                <TabsTrigger value="gallery" className="flex items-center">
                  <ImageIcon className="mr-2" size={18} />
                  Galerie
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center">
                  <Settings className="mr-2" size={18} />
                  Einstellungen
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="camera" className="mt-0">
                <CameraView />
              </TabsContent>
              
              <TabsContent value="gallery" className="mt-0">
                <Gallery />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-lg font-medium mb-4">Kamera-Einstellungen</h2>
                  <SettingsPanel />
                </div>
              </TabsContent>
            </Tabs>
          </main>
          
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </GalleryProvider>
    </CameraProvider>
  );
};

export default App;
