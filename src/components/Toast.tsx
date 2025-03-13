import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  
  return (
    <div className={`flex items-center p-4 mb-3 border-l-4 rounded-md shadow-md ${bgColor} ${borderColor}`}>
      <Icon className={`mr-3 ${textColor}`} size={20} />
      <div className={`flex-1 ${textColor}`}>{message}</div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
