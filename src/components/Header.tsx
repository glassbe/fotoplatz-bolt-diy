import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <div className="flex items-center">
          <Camera className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">Web Camera App</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
