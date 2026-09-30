import { EmailChunk, ChunkScanResult } from '../../types';

/**
 * Scan individual retrieved email chunks for embedded indirect prompt injection.
 * High-risk chunks are quarantined and excluded from LLM context.
 */
export async function scanRetrievedChunk(chunk: EmailChunk): Promise<ChunkScanResult> {
  const content = chunk.content || '';
  let highestRisk = 3; // Baseline clean noise floor (3-6%)
  const reasons: string[] = [];

  const indirectInjectionPatterns = [
    {
      regex: /(ignore|disregard|forget|override)\s+(all\s+)?(previous|prior|above|system)\s+(instructions|directives|prompts|rules)/i,
      weight: 96,
      reason: 'Embedded instruction override ("Ignore previous instructions") detected in chunk body'
    },
    {
      regex: /(system\s*message:|system\s*instruction:|system\s*prompt:|developer\s*note:|admin\s*override:)/i,
      weight: 94,
      reason: 'Role impersonation tag attempting to spoof system level instructions'
    },
    {
      regex: /(send\s+(this|all|confidential)\s+(data|email|archive|information)\s+to|forward\s+to\s+https?:\/\/|exfiltrate)/i,
      weight: 92,
      reason: 'Exfiltration command payload embedded in email content'
    },
    {
      regex: /(reveal|leak|print|show)\s+(confidential|secret|internal|private)\s+(passwords?|keys?|credentials?)/i,
      weight: 88,
      reason: 'Malicious instruction probing for credential exposure'
    },
    {
      regex: /(when\s+asked\s+about.*you\s+must\s+(say|answer|claim)|always\s+tell\s+the\s+user\s+that)/i,
      weight: 82,
      reason: 'Behavior manipulation rule injecting unauthorized response steering'
    },
    {
      regex: /(<script|javascript:|eval\(|base64_decode)/i,
      weight: 85,
      reason: 'Suspicious executable scripting payload inside message'
    }
  ];

  for (const pattern of indirectInjectionPatterns) {
    if (pattern.regex.test(content)) {
      if (pattern.weight > highestRisk) {
        highestRisk = pattern.weight;
      }
      reasons.push(pattern.reason);
    }
  }

  // Check if chunk is marked as simulated carrier
  if (content.includes('[MALICIOUS_INJECTION_TEST_PAYLOAD]')) {
    highestRisk = 98;
    reasons.push('Verified Trojan injection payload identified in simulated attack email');
  }

  const isQuarantined = highestRisk >= 60;

  return {
    risk_score: highestRisk,
    is_suspicious: isQuarantined,
    status: isQuarantined ? 'QUARANTINED' : 'SAFE',
    reason: reasons.length > 0 ? reasons[0] : 'Content verified safe data chunk',
    chunk_id: chunk.chunk_id,
    email_id: chunk.email_id
  };
}
