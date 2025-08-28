import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ScanForm from './components/ScanForm';
import Loader from './components/Loader';
import ReportDisplay from './components/ReportDisplay';
import { generateVulnerabilityReport } from './services/geminiService';
import { VulnerabilityReport, ScanOptions } from './types';
import AlertTriangleIcon from './components/icons/AlertTriangleIcon';

const App: React.FC = () => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'completed' | 'error'>('idle');
  const [report, setReport] = useState<VulnerabilityReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanTarget, setScanTarget] = useState<{url: string; options: ScanOptions} | null>(null);

  const handleStartScan = useCallback(async (url: string, options: ScanOptions) => {
    setScanState('scanning');
    setError(null);
    setReport(null);
    setScanTarget({ url, options });

    try {
      const generatedReport = await generateVulnerabilityReport(url, options);
      setReport(generatedReport);
      setScanState('completed');
    } catch (err) {
      console.error("Error during scan:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during the scan. Please check the console for details.");
      setScanState('error');
    }
  }, []);

  const handleReset = () => {
    setScanState('idle');
    setReport(null);
    setError(null);
    setScanTarget(null);
  };

  const renderContent = () => {
    switch (scanState) {
      case 'scanning':
        return <Loader url={scanTarget?.url ?? ''} />;
      case 'completed':
        return report && scanTarget && <ReportDisplay report={report} targetUrl={scanTarget.url} onReset={handleReset} />;
      case 'error':
        return (
          <div className="text-center text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
               <AlertTriangleIcon className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Scan Failed</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case 'idle':
      default:
        // FIX: Replaced `scanState === 'scanning'` with `false`. In this switch case, `scanState` is
        // known to be 'idle', making the original comparison always false and causing a TypeScript error.
        return <ScanForm onScanStart={handleStartScan} isScanning={false} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_400px_at_50%_200px,#1e293b,transparent)] opacity-20"></div>
      <div className="relative isolate min-h-screen flex flex-col items-center justify-center p-4">
        <Header onReset={handleReset} showReset={scanState !== 'idle' && scanState !== 'scanning'} />
        <main className="w-full max-w-7xl mx-auto mt-8 flex-grow">
          {renderContent()}
        </main>
        <footer className="text-center py-4 text-gray-500 text-sm mt-8">
            <p>CyberGuard Vulnerability Scanner. For demonstration purposes only.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
