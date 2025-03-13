import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  imageSrc: string;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ imageSrc, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
        >
          <X size={24} />
        </button>
        
        <div className="bg-white rounded-lg overflow-hidden">
          <img 
            src={imageSrc} 
            alt="Preview" 
            className="max-h-[80vh] max-w-full object-contain mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
