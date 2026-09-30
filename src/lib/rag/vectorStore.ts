import { EmailChunk } from '../../types';
import { ENRON_DEMO_EMAILS } from './enronDemoData';
import { dynamicChunkEmail } from '../chunking/dynamicChunker';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface RetrievalResult {
  chunk: EmailChunk;
  similarity: number;
}

/**
 * Lightweight deterministic 128-dimensional embedding generator
 * Used for zero-latency in-memory vector search when external embedding API is in fallback mode.
 */
function createDeterministicEmbedding(text: string): number[] {
  const dims = 128;
  const vec = new Array(dims).fill(0);
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = normalized.split(/\s+/).filter(w => w.length > 2);

  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dims;
    vec[idx] += 1.0;
  }

  // Normalize vector to unit length
  let norm = 0;
  for (let i = 0; i < dims; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dims; i++) {
      vec[i] /= norm;
    }
  }

  return vec;
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Math.max(0, Math.min(1, dotProduct));
}

class VectorStore {
  private indexedChunks: EmailChunk[] = [];
  private isIndexed: boolean = false;
  private totalEnronEmailsCount: number = 10482; // Total Enron archive catalog count
  private indexedEmailsCount: number = ENRON_DEMO_EMAILS.length;

  constructor() {
    this.indexDemoCorpus();
  }

  public indexDemoCorpus() {
    this.indexedChunks = [];
    for (const email of ENRON_DEMO_EMAILS) {
      const chunks = dynamicChunkEmail(email);
      for (const chunk of chunks) {
        chunk.embedding = createDeterministicEmbedding(`${chunk.subject} ${chunk.content} ${chunk.sender}`);
        this.indexedChunks.push(chunk);
      }
    }
    this.isIndexed = true;
  }

  public getIndexStatus() {
    return {
      isIndexed: this.isIndexed,
      totalCatalog: this.totalEnronEmailsCount,
      activeIndexedEmails: this.indexedEmailsCount,
      totalChunks: this.indexedChunks.length,
      isSupabaseActive: isSupabaseConfigured(),
      storageType: isSupabaseConfigured() ? 'Supabase pgvector' : 'In-Memory Local Vector Index (Demo Ready)'
    };
  }

  public async retrieveEmails(query: string, topK: number = 5): Promise<RetrievalResult[]> {
    // If Supabase pgvector is configured, query the vector database
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.rpc('match_email_chunks', {
          query_text: query,
          match_count: topK
        });
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            chunk: {
              chunk_id: item.chunk_id,
              email_id: item.email_id,
              chunk_type: item.chunk_type,
              chunk_reason: item.chunk_reason,
              subject: item.subject,
              sender: item.sender,
              content: item.content,
              token_count: item.token_count,
              source: 'enron'
            },
            similarity: item.similarity
          }));
        }
      } catch (err) {
        console.warn('Supabase retrieval failed, using fallback in-memory index:', err);
      }
    }

    // High-performance In-Memory Vector Search Fallback
    const queryVec = createDeterministicEmbedding(query);
    const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    const scored = this.indexedChunks.map(chunk => {
      let sim = 0;
      if (chunk.embedding) {
        sim = cosineSimilarity(queryVec, chunk.embedding);
      }

      // Keyword boost
      const contentLower = `${chunk.subject} ${chunk.content} ${chunk.sender}`.toLowerCase();
      let matchedTerms = 0;
      for (const term of queryTerms) {
        if (contentLower.includes(term)) {
          matchedTerms++;
        }
      }

      if (queryTerms.length > 0) {
        const keywordRatio = matchedTerms / queryTerms.length;
        sim = sim * 0.5 + keywordRatio * 0.5;
      }

      return {
        chunk,
        similarity: Math.round(sim * 100) / 100
      };
    });

    // Sort descending by similarity score
    scored.sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, topK);
  }

  public getAllChunks(): EmailChunk[] {
    return this.indexedChunks;
  }
}

export const vectorStore = new VectorStore();
export const retrieveEmails = (query: string, topK: number = 5) => vectorStore.retrieveEmails(query, topK);
