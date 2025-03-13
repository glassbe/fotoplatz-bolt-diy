import React from 'react';

interface FileNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

const FileNameInput: React.FC<FileNameInputProps> = ({ 
  value, 
  onChange, 
  placeholder,
  error
}) => {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Dateiname"}
        className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {value && (
        <span className="absolute right-3 top-2 text-gray-400">.jpg</span>
      )}
    </div>
  );
};

export default FileNameInput;
