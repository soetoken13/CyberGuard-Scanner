
export interface ScanOptions {
  owaspTop10: boolean;
  iso27001: boolean;
}

export enum Severity {
    Critical = 'Critical',
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
    Informational = 'Informational'
}

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  impact: string;
  remediation: string;
  standard: 'OWASP Top 10' | 'ISO 27001' | 'General';
}

export interface VulnerabilityReport {
  executiveSummary: string;
  vulnerabilities: Vulnerability[];
}
