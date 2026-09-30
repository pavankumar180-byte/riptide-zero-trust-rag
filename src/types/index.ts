export interface Email {
  id: string;
  subject: string;
  sender: string;
  recipients: string[];
  date: string;
  body: string;
  source: 'enron';
  is_malicious_test_carrier?: boolean;
}

export type ChunkType = 'header' | 'greeting' | 'paragraph' | 'quoted_reply' | 'signature' | 'semantic_section';

export type ChunkReason = 
  | 'email_header_boundary'
  | 'paragraph_boundary'
  | 'quoted_reply_block'
  | 'signature_delimiter'
  | 'semantic_topic_shift'
  | 'conversation_section';

export interface EmailChunk {
  chunk_id: string;
  email_id: string;
  chunk_type: ChunkType;
  chunk_reason: ChunkReason;
  subject: string;
  sender: string;
  content: string;
  token_count: number;
  source: string;
  embedding?: number[];
}

export interface QueryScanResult {
  risk_score: number; // 0-100
  is_suspicious: boolean;
  status: 'SAFE' | 'BLOCKED';
  reason: string;
  matched_patterns: string[];
}

export interface ChunkScanResult {
  risk_score: number; // 0-100
  is_suspicious: boolean;
  status: 'SAFE' | 'QUARANTINED';
  reason: string;
  chunk_id: string;
  email_id: string;
}

export interface PIIRedactionItem {
  type: 'email' | 'phone' | 'ssn' | 'card' | 'key';
  original_snippet: string;
  replacement: string;
}

export interface PIIScanResult {
  sanitized_text: string;
  leaks_detected: number;
  status: 'SAFE' | 'REDACTED';
  redactions: PIIRedactionItem[];
}

export interface CitedSource {
  email_id: string;
  subject: string;
  sender: string;
  risk_score: number;
  excerpt: string;
  chunk_type: ChunkType;
  chunk_reason: ChunkReason;
  size_tokens: number;
  status: 'SAFE' | 'QUARANTINED';
  similarity: number;
}

export interface RAGResult {
  query: string;
  query_security: QueryScanResult;
  retrieved_chunks: Array<{
    chunk: EmailChunk;
    scan: ChunkScanResult;
    similarity: number;
  }>;
  safe_chunks_count: number;
  quarantined_chunks_count: number;
  evidence_grounded: boolean;
  raw_answer: string;
  final_answer: string;
  pii_guard: PIIScanResult;
  sources: CitedSource[];
  trust_score_delta: number;
  trust_score_current: number;
  execution_time_ms: number;
}

export interface TrustScoreState {
  score: number;
  status: 'SAFE' | 'CAUTION' | 'COMPROMISED';
  history: Array<{
    timestamp: string;
    change: number;
    new_score: number;
    reason: string;
  }>;
}

export interface AttackDemoPreset {
  id: string;
  title: string;
  category: 'DIRECT_INJECTION' | 'INDIRECT_CHUNK_INJECTION' | 'PII_LEAK_PROBE' | 'NORMAL_QUERY' | 'HALLUCINATION_PROBE';
  prompt: string;
  expected_outcome: string;
  description: string;
}
