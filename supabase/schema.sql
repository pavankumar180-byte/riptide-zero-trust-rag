-- ========================================================
-- RIPTIDE — ZERO-TRUST VOICE RAG: SUPABASE PGVECTOR SCHEMA
-- ========================================================

-- 1. Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the parent emails table
CREATE TABLE IF NOT EXISTS enron_emails (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  sender TEXT NOT NULL,
  recipients TEXT[] DEFAULT '{}',
  date TIMESTAMP WITH TIME ZONE,
  body TEXT NOT NULL,
  source TEXT DEFAULT 'enron',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the structure-aware email chunks table
CREATE TABLE IF NOT EXISTS email_chunks (
  chunk_id TEXT PRIMARY KEY,
  email_id TEXT REFERENCES enron_emails(id) ON DELETE CASCADE,
  chunk_type TEXT NOT NULL,       -- 'header', 'paragraph', 'quoted_reply', 'signature', 'semantic_section'
  chunk_reason TEXT NOT NULL,     -- 'paragraph_boundary', 'email_header_boundary', etc.
  subject TEXT NOT NULL,
  sender TEXT NOT NULL,
  content TEXT NOT NULL,
  token_count INT NOT NULL,
  embedding vector(1536),         -- 1536-dimensional vector for text-embedding-3-small
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create an HNSW index for ultra-fast approximate cosine similarity search
CREATE INDEX IF NOT EXISTS email_chunks_embedding_hnsw_idx 
ON email_chunks 
USING hnsw (embedding vector_cosine_ops);

-- 5. Stored Procedure for top-K cosine similarity matching
CREATE OR REPLACE FUNCTION match_email_chunks (
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.3,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  chunk_id TEXT,
  email_id TEXT,
  chunk_type TEXT,
  chunk_reason TEXT,
  subject TEXT,
  sender TEXT,
  content TEXT,
  token_count INT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ec.chunk_id,
    ec.email_id,
    ec.chunk_type,
    ec.chunk_reason,
    ec.subject,
    ec.sender,
    ec.content,
    ec.token_count,
    1 - (ec.embedding <=> query_embedding) AS similarity
  FROM email_chunks ec
  WHERE 1 - (ec.embedding <=> query_embedding) > match_threshold
  ORDER BY ec.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
