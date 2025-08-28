
import React from 'react';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface HeaderProps {
    onReset: () => void;
    showReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="w-full max-w-7xl mx-auto flex justify-between items-center py-4 px-2">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
        <ShieldCheckIcon className="w-10 h-10 text-indigo-400" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-3xl">
          CyberGuard Scanner
        </h1>
      </div>
      {showReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/80 text-white font-semibold rounded-lg text-sm transition-colors"
        >
          New Scan
        </button>
      )}
    </header>
  );
};

export default Header;
