import { QueryScanResult } from '../../types';

/**
 * Interface for pluggable ML / External API Injection Classifiers
 * (e.g. Lakera Guard, Llama Guard, NeMo Guardrails, Azure AI Content Safety)
 */
export interface IQueryInjectionClassifier {
  classify(query: string): Promise<QueryScanResult>;
}

/**
 * High-precision, zero-trust pattern and semantic heuristic engine.
 * Transparently labeled as a structural heuristic scanner ready for ML backend binding.
 */
export class HeuristicQueryInjectionClassifier implements IQueryInjectionClassifier {
  private readonly attackVectors = [
    {
      regex: /(ignore|disregard|forget|override|bypass|drop)\s+(all\s+)?(previous|prior|above|system|core|security)\s+(instructions|directives|prompts|rules|guidelines|filters)/i,
      weight: 95,
      reason: 'Direct instruction override attempt detected ("ignore previous instructions")'
    },
    {
      regex: /(system\s*prompt|system\s*instruction|developer\s*mode|god\s*mode|jailbreak|unfiltered\s*mode|dan\s*mode)/i,
      weight: 90,
      reason: 'System role alteration or jailbreak persona attempt detected'
    },
    {
      regex: /(reveal|print|display|dump|leak|output|show)\s+(all\s+)?(confidential|secret|private|system|internal|passwords|keys|database|prompts)/i,
      weight: 85,
      reason: 'Unauthorized confidential data or prompt exfiltration probe'
    },
    {
      regex: /(<\|im_start\|>|<\|system\|>|\[INST\]|###\s*instruction|###\s*system|<system>|<<SYS>>)/i,
      weight: 98,
      reason: 'LLM raw control token delimiter injection attempt'
    },
    {
      regex: /(you\s+are\s+now|from\s+now\s+on\s+you|pretend\s+you\s+are|roleplay\s+as\s+an?\s+unrestricted)/i,
      weight: 75,
      reason: 'Persona hijacking / roleplay instruction injection'
    },
    {
      regex: /(base64|rot13|hex\s+decode|execute\s+python|curl\s+https?:\/\/|wget\s+https?:\/\/)/i,
      weight: 70,
      reason: 'Code execution or payload obfuscation pattern'
    },
    {
      regex: /(send\s+(this|data|email)\s+to\s+https?:\/\/|exfiltrate|webhook\.site)/i,
      weight: 95,
      reason: 'Data exfiltration endpoint injection'
    }
  ];

  async classify(query: string): Promise<QueryScanResult> {
    const trimmed = (query || '').trim();
    if (!trimmed) {
      return {
        risk_score: 0,
        is_suspicious: false,
        status: 'SAFE',
        reason: 'Empty query',
        matched_patterns: []
      };
    }

    let highestRisk = 2; // Baseline noise floor (2-4%)
    const matchedPatterns: string[] = [];
    const reasons: string[] = [];

    for (const vector of this.attackVectors) {
      if (vector.regex.test(trimmed)) {
        if (vector.weight > highestRisk) {
          highestRisk = vector.weight;
        }
        matchedPatterns.push(vector.regex.source);
        reasons.push(vector.reason);
      }
    }

    // Secondary heuristic: excessively abnormal character ratios or punctuation stacking
    if (trimmed.length > 50 && (trimmed.match(/[{}[\]\\<>;$]/g) || []).length > 8) {
      highestRisk = Math.max(highestRisk, 65);
      reasons.push('Abnormal density of structural programming syntax in spoken/typed text');
    }

    const isSuspicious = highestRisk >= 60;
    const isBlocked = highestRisk >= 70;

    let primaryReason = 'Query verified clean and passed Zero-Trust gate';
    if (reasons.length > 0) {
      primaryReason = reasons[0];
    } else if (highestRisk > 20) {
      primaryReason = 'Low anomaly score within safe operational bounds';
    }

    return {
      risk_score: highestRisk,
      is_suspicious: isSuspicious,
      status: isBlocked ? 'BLOCKED' : 'SAFE',
      reason: primaryReason,
      matched_patterns: matchedPatterns
    };
  }
}

// Global scanner instance
const defaultClassifier = new HeuristicQueryInjectionClassifier();

/**
 * Mandatory function: scanQueryForInjection(query)
 * Returns { risk_score, is_suspicious, status, reason }
 */
export async function scanQueryForInjection(query: string): Promise<QueryScanResult> {
  return await defaultClassifier.classify(query);
}
