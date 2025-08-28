
import React, { useState } from 'react';
import { ScanOptions } from '../types';

interface ScanFormProps {
  onScanStart: (url: string, options: ScanOptions) => void;
  isScanning: boolean;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScanStart, isScanning }) => {
  const [url, setUrl] = useState<string>('');
  const [options, setOptions] = useState<ScanOptions>({
    owaspTop10: true,
    iso27001: false,
  });
  const [error, setError] = useState<string>('');

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.checked });
  };
  
  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Target URL cannot be empty.');
      return;
    }
    if(!isValidUrl(url)){
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }
    if (!options.owaspTop10 && !options.iso27001) {
      setError('Please select at least one assessment standard.');
      return;
    }
    setError('');
    onScanStart(url, options);
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI-Powered Vulnerability Assessment
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-400">
            Enter a web application URL to begin a simulated penetration test. Our AI will generate a detailed security report based on industry standards.
        </p>
      <form onSubmit={handleSubmit} className="mt-10">
        <div className="flex gap-x-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-auto rounded-md border-0 bg-white/5 px-4 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
            disabled={isScanning}
          />
          <button
            type="submit"
            disabled={isScanning}
            className="flex-none rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isScanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
        
        <div className="mt-6">
            <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-300">Assessment Standards</legend>
                <div className="mt-4 flex justify-center space-x-6">
                    <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input id="owasp" name="owaspTop10" type="checkbox" checked={options.owaspTop10} onChange={handleOptionChange} className="h-4 w-4 rounded border-gray-300/20 bg-white/5 text-indigo-600 focus:ring-indigo-600" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor="owasp" className="font-medium text-gray-300">OWASP Top 10</label>
                        </div>
                    </div>
                    <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input id="iso" name="iso27001" type="checkbox" checked={options.iso27001} onChange={handleOptionChange} className="h-4 w-4 rounded border-gray-300/20 bg-white/5 text-indigo-600 focus:ring-indigo-600" />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                            <label htmlFor="iso" className="font-medium text-gray-300">ISO 27001</label>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default ScanForm;
