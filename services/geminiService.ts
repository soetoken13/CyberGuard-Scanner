
import { GoogleGenAI, Type } from "@google/genai";
import { ScanOptions, VulnerabilityReport } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const reportSchema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: {
      type: Type.STRING,
      description: "A high-level summary of the findings, written for a non-technical audience like executives. It should state the overall security posture and key risks.",
    },
    vulnerabilities: {
      type: Type.ARRAY,
      description: "A detailed list of all vulnerabilities found.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "A unique identifier for the vulnerability, e.g., 'A01:2021' for OWASP or a relevant ISO control number.",
          },
          title: {
            type: Type.STRING,
            description: "A concise, descriptive title for the vulnerability.",
          },
          severity: {
            type: Type.STRING,
            enum: ['Critical', 'High', 'Medium', 'Low', 'Informational'],
            description: "The severity level of the vulnerability.",
          },
          description: {
            type: Type.STRING,
            description: "A detailed explanation of the vulnerability, including what it is and how it was discovered.",
          },
          impact: {
            type: Type.STRING,
            description: "The potential business impact if this vulnerability is exploited.",
          },
          remediation: {
            type: Type.STRING,
            description: "Clear, actionable steps to fix the vulnerability.",
          },
          standard: {
            type: Type.STRING,
            enum: ['OWASP Top 10', 'ISO 27001', 'General'],
            description: "The security standard this vulnerability relates to.",
          }
        },
        required: ["id", "title", "severity", "description", "impact", "remediation", "standard"],
      },
    },
  },
  required: ["executiveSummary", "vulnerabilities"],
};


export const generateVulnerabilityReport = async (url: string, options: ScanOptions): Promise<VulnerabilityReport> => {
  const standards = [];
  if (options.owaspTop10) standards.push("OWASP Top 10 2021");
  if (options.iso27001) standards.push("relevant controls from ISO/IEC 27001:2022");

  const prompt = `
    Act as a senior penetration tester and cybersecurity analyst.
    Your task is to perform a simulated vulnerability assessment of the web application at the URL: ${url}.
    Generate a detailed and realistic vulnerability report based on the following standards: ${standards.join(', ')}.
    The report should be comprehensive, professional, and provide actionable insights.
    
    Do not mention that this is a simulation. Present the findings as if a real scan was performed.
    
    Invent a plausible set of findings. Ensure the number of vulnerabilities is realistic, between 5 and 10 findings.
    Vary the severity of the findings (e.g., a mix of Critical, High, Medium, and Low).
    For each vulnerability, provide a clear description, its potential impact, and specific, actionable remediation advice.
    The executive summary should be concise and suitable for management.
    
    Return the entire report in a single JSON object that conforms to the provided schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema,
      },
    });

    const jsonText = response.text.trim();
    const reportData = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches the expected structure.
    if (!reportData.executiveSummary || !Array.isArray(reportData.vulnerabilities)) {
        throw new Error("Generated report has an invalid structure.");
    }

    return reportData as VulnerabilityReport;
  } catch (error) {
    console.error("Error generating report from Gemini API:", error);
    throw new Error("Failed to generate the vulnerability report. The AI model may be temporarily unavailable or the request could not be processed.");
  }
};
