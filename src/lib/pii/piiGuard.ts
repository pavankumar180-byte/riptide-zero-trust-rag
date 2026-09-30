import { PIIScanResult, PIIRedactionItem } from '../../types';

/**
 * PII / Personal Data Leak Guard
 * Executes strictly AFTER LLM generation and BEFORE UI rendering.
 * Never trusts the LLM to redact itself.
 */
export function redactPII(text: string): PIIScanResult {
  if (!text) {
    return {
      sanitized_text: '',
      leaks_detected: 0,
      status: 'SAFE',
      redactions: []
    };
  }

  let sanitized = text;
  const redactions: PIIRedactionItem[] = [];

  // 1. Email Address Detection & Redaction
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi;
  sanitized = sanitized.replace(emailRegex, (match) => {
    redactions.push({
      type: 'email',
      original_snippet: match,
      replacement: '[EMAIL REDACTED]'
    });
    return '[EMAIL REDACTED]';
  });

  // 2. Phone Number Detection & Redaction (International and US formats)
  // Handles +91 9876543210, (555) 123-4567, 555-123-4567, +1-800-555-0199, etc.
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}\b/g;
  sanitized = sanitized.replace(phoneRegex, (match) => {
    // Avoid redacting pure numbers like years (e.g. 2001, 1999) or small dollar amounts ($500)
    const digitsOnly = match.replace(/\D/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) return match;
    // Disqualify standard 4-digit years
    if (digitsOnly.length === 4) return match;

    redactions.push({
      type: 'phone',
      original_snippet: match,
      replacement: '[PHONE REDACTED]'
    });
    return '[PHONE REDACTED]';
  });

  // 3. Social Security Number (SSN) Detection
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  sanitized = sanitized.replace(ssnRegex, (match) => {
    redactions.push({
      type: 'ssn',
      original_snippet: match,
      replacement: '[SSN REDACTED]'
    });
    return '[SSN REDACTED]';
  });

  // 4. Credit Card Number Detection
  const creditCardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
  sanitized = sanitized.replace(creditCardRegex, (match) => {
    redactions.push({
      type: 'card',
      original_snippet: match,
      replacement: '[CARD REDACTED]'
    });
    return '[CARD REDACTED]';
  });

  const leakCount = redactions.length;

  return {
    sanitized_text: sanitized,
    leaks_detected: leakCount,
    status: leakCount > 0 ? 'REDACTED' : 'SAFE',
    redactions
  };
}
