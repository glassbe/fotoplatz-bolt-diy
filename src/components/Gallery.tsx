import React, { useState } from 'react';
import { useGallery } from '../contexts/GalleryContext';
import { Trash2, Eye } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';
import ConfirmationDialog from './ConfirmationDialog';

const Gallery: React.FC = () => {
  const { images, removeImage } = useGallery();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const openPreview = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closePreview = () => {
    setSelectedImage(null);
  };

  const handleDeleteConfirmation = (imageId: string) => {
    setImageToDelete(imageId);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      removeImage(imageToDelete);
      setImageToDelete(null);
    }
  };

  const cancelDelete = () => {
    setImageToDelete(null);
  };

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-medium mb-4">Galerie</h2>
        <div className="text-center py-8 text-gray-500">
          Keine Bilder vorhanden
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-medium mb-4">Galerie</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={image.src} 
                alt={image.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button 
                onClick={() => openPreview(image.src)}
                className="p-1.5 bg-blue-600 text-white rounded-full mx-1"
              >
                <Eye size={16} />
              </button>
              <button 
                onClick={() => handleDeleteConfirmation(image.id)}
                className="p-1.5 bg-red-600 text-white rounded-full mx-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <p className="mt-1 text-sm text-gray-700 truncate">{image.name}</p>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <ImagePreviewModal 
          imageSrc={selectedImage} 
          onClose={closePreview} 
        />
      )}

      <ConfirmationDialog 
        isOpen={!!imageToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Bild löschen"
        message="Sind Sie sicher, dass Sie dieses Bild löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
      />
    </div>
  );
};

export default Gallery;
