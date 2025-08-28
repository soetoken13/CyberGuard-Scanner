
import React from 'react';

interface LoaderProps {
  url: string;
}

const Loader: React.FC<LoaderProps> = ({ url }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white">Scanning In Progress...</h2>
      <p className="text-gray-400 mt-2">
        Performing AI-driven analysis on: <span className="font-mono text-indigo-300">{url}</span>
      </p>
      <p className="text-sm text-gray-500 mt-4">This may take a moment. Please do not close the window.</p>
    </div>
  );
};

export default Loader;
