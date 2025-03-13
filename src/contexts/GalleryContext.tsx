import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Image {
  id: string;
  name: string;
  src: string;
  timestamp: string;
}

interface GalleryContextType {
  images: Image[];
  addImage: (image: Image) => void;
  removeImage: (id: string) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

const STORAGE_KEY = 'web-camera-gallery';

export const GalleryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<Image[]>([]);

  // Load images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem(STORAGE_KEY);
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (error) {
        console.error('Failed to parse saved images:', error);
      }
    }
  }, []);

  // Save images to localStorage when they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }, [images]);

  const addImage = (image: Image) => {
    setImages(prev => [image, ...prev]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(image => image.id !== id));
  };

  return (
    <GalleryContext.Provider value={{ images, addImage, removeImage }}>
      {children}
    </GalleryContext.Provider>
  );
};

export const useGallery = (): GalleryContextType => {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};
