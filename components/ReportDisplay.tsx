
import React, { useRef, useState } from 'react';
import { VulnerabilityReport, Severity } from '../types';
import FileDownIcon from './icons/FileDownIcon';

// Using window objects for jspdf and html2canvas since they are loaded from CDN
declare const jspdf: any;
declare const html2canvas: any;

interface ReportDisplayProps {
  report: VulnerabilityReport;
  targetUrl: string;
  onReset: () => void;
}

const severityConfig = {
  [Severity.Critical]: { color: 'bg-red-500', textColor: 'text-red-300', ringColor: 'ring-red-500/30' },
  [Severity.High]: { color: 'bg-orange-500', textColor: 'text-orange-300', ringColor: 'ring-orange-500/30' },
  [Severity.Medium]: { color: 'bg-yellow-500', textColor: 'text-yellow-300', ringColor: 'ring-yellow-500/30' },
  [Severity.Low]: { color: 'bg-blue-500', textColor: 'text-blue-300', ringColor: 'ring-blue-500/30' },
  [Severity.Informational]: { color: 'bg-gray-500', textColor: 'text-gray-300', ringColor: 'ring-gray-500/30' },
};

const SeverityBadge: React.FC<{ severity: Severity }> = ({ severity }) => {
  const config = severityConfig[severity] || severityConfig[Severity.Informational];
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.textColor} ring-1 ring-inset ${config.ringColor} ${config.color}/20`}>
      {severity}
    </span>
  );
};

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, targetUrl, onReset }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);

    try {
      const { jsPDF } = jspdf;
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const urlHostname = new URL(targetUrl).hostname;
      pdf.save(`Vulnerability-Report-${urlHostname}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const severityCounts = report.vulnerabilities.reduce((acc, v) => {
    acc[v.severity] = (acc[v.severity] || 0) + 1;
    return acc;
  }, {} as Record<Severity, number>);

  return (
    <div className="w-full">
      <div className="flex justify-end items-center mb-6 gap-4">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          <FileDownIcon className="w-4 h-4" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
      </div>
      <div ref={reportRef} className="bg-gray-900/50 p-8 rounded-lg border border-gray-700/50">
        <div className="border-b border-gray-700 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-white">Vulnerability Assessment Report</h1>
            <p className="text-gray-400 mt-2">Target: <span className="font-mono text-indigo-300">{targetUrl}</span></p>
            <p className="text-gray-400">Scan Date: <span className="font-mono">{new Date().toLocaleDateString()}</span></p>
        </div>

        <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white border-l-4 border-indigo-400 pl-4 mb-4">Executive Summary</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{report.executiveSummary}</p>
        </div>

        <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white border-l-4 border-indigo-400 pl-4 mb-6">Findings Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                {Object.entries(severityConfig).map(([severity, config]) => (
                    <div key={severity} className={`p-4 rounded-lg bg-gray-800/50 border border-gray-700/60`}>
                        <p className={`text-3xl font-bold ${config.textColor}`}>{severityCounts[severity as Severity] || 0}</p>
                        <p className="text-sm font-medium text-gray-400 mt-1">{severity}</p>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-2xl font-semibold text-white border-l-4 border-indigo-400 pl-4 mb-6">Detailed Vulnerabilities</h2>
            <div className="space-y-6">
                {report.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="bg-gray-800/50 border border-gray-700/60 rounded-lg overflow-hidden">
                        <div className="p-4 flex justify-between items-start bg-gray-900/30 border-b border-gray-700/60">
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-300">{vuln.id}: {vuln.title}</h3>
                                <p className="text-xs text-gray-400">{vuln.standard}</p>
                            </div>
                            <SeverityBadge severity={vuln.severity} />
                        </div>
                        <div className="p-4 grid md:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-200 mb-1">Description</h4>
                                <p className="text-sm text-gray-400 whitespace-pre-wrap">{vuln.description}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-gray-200 mb-1">Impact</h4>
                                <p className="text-sm text-gray-400 whitespace-pre-wrap">{vuln.impact}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-200 mb-1">Remediation</h4>
                                <p className="text-sm text-gray-400 whitespace-pre-wrap font-mono bg-black/30 p-2 rounded">{vuln.remediation}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDisplay;
