import { Email, EmailChunk, ChunkType, ChunkReason } from '../../types';

/**
 * Calculates approximate token count based on whitespace and subword estimation
 */
export function estimateTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  const words = text.trim().split(/\s+/).length;
  // English text average: ~1.3 tokens per word, plus punctuation allowance
  return Math.max(1, Math.round(words * 1.3));
}

/**
 * STRUCTURE-AWARE DYNAMIC CHUNKING
 * Strictly avoids fixed-token or fixed-character slicing.
 * Identifies headers, greetings, body paragraphs, quoted chains, signatures, and semantic blocks.
 */
export function dynamicChunkEmail(email: Email): EmailChunk[] {
  const chunks: EmailChunk[] = [];
  const body = email.body || '';
  let chunkIndex = 1;

  // 1. Header Chunk (if headers present or synthesized from email object)
  const headerContent = `Subject: ${email.subject}\nFrom: ${email.sender}\nTo: ${email.recipients.join(', ')}\nDate: ${email.date}`;
  chunks.push({
    chunk_id: `${email.id}_chk_${chunkIndex++}`,
    email_id: email.id,
    chunk_type: 'header',
    chunk_reason: 'email_header_boundary',
    subject: email.subject,
    sender: email.sender,
    content: headerContent.trim(),
    token_count: estimateTokens(headerContent),
    source: email.source || 'enron',
  });

  if (!body.trim()) {
    return chunks;
  }

  // 2. Separate Quoted Replies / Forwarded Messages
  // Detect patterns like "-----Original Message-----", "From: ... Sent: ...", or lines starting with ">"
  let mainBody = body;
  let quotedReplyContent = '';
  
  const originalMsgMarker = body.search(/(-{3,}\s*Original Message\s*-{3,}|From:.*?\nSent:.*?\nTo:.*?\nSubject:)/i);
  if (originalMsgMarker !== -1) {
    quotedReplyContent = body.slice(originalMsgMarker).trim();
    mainBody = body.slice(0, originalMsgMarker).trim();
  }

  // Also check for trailing block quotes with "> "
  const lines = mainBody.split('\n');
  const nonQuotedLines: string[] = [];
  const quoteLines: string[] = [];

  let inQuoteBlock = false;
  for (const line of lines) {
    if (line.trim().startsWith('>')) {
      inQuoteBlock = true;
      quoteLines.push(line);
    } else {
      if (inQuoteBlock && line.trim() === '') {
        // empty line in quote
        quoteLines.push(line);
      } else {
        inQuoteBlock = false;
        nonQuotedLines.push(line);
      }
    }
  }

  if (quoteLines.length > 0) {
    const combinedQuotes = quoteLines.join('\n').trim();
    if (combinedQuotes) {
      quotedReplyContent = quotedReplyContent 
        ? `${quotedReplyContent}\n\n${combinedQuotes}`
        : combinedQuotes;
      mainBody = nonQuotedLines.join('\n').trim();
    }
  }

  // 3. Separate Signature Block
  // Detect common signature delimiters like "--", "Best regards,", "Sincerely,", "Thanks," near the end
  const sigMatch = mainBody.search(/(\n--\s*\n|\nBest regards[,\s]|\nRegards[,\s]|\nSincerely[,\s]|\nThanks[,\s]|\nThank you[,\s]|\nCheers[,\s])/i);
  let signatureContent = '';
  if (sigMatch !== -1) {
    signatureContent = mainBody.slice(sigMatch).trim();
    mainBody = mainBody.slice(0, sigMatch).trim();
  }

  // 4. Process Main Body Paragraphs & Semantic Boundaries
  // Split on paragraph boundaries (double newline)
  const rawParagraphs = mainBody
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];

    // Detect Greeting / Salutation
    const isGreeting = i === 0 && /^(hi|hello|dear|hey|team|all|good morning|good afternoon)\b/i.test(p) && p.split('\n').length <= 2;
    if (isGreeting) {
      chunks.push({
        chunk_id: `${email.id}_chk_${chunkIndex++}`,
        email_id: email.id,
        chunk_type: 'greeting',
        chunk_reason: 'conversation_section',
        subject: email.subject,
        sender: email.sender,
        content: p,
        token_count: estimateTokens(p),
        source: email.source || 'enron',
      });
      continue;
    }

    // Detect Tables, Bullet Lists, or Action Items (Semantic Topic Shift)
    const isListOrTable = /^[•\-*0-9]+[.)\s]/m.test(p) || p.includes('|') || p.includes(':\n');
    const isTopicHeader = p.length < 90 && p.endsWith(':');

    let chunkType: ChunkType = 'paragraph';
    let chunkReason: ChunkReason = 'paragraph_boundary';

    if (isListOrTable) {
      chunkType = 'semantic_section';
      chunkReason = 'semantic_topic_shift';
    } else if (isTopicHeader) {
      chunkType = 'semantic_section';
      chunkReason = 'conversation_section';
    }

    chunks.push({
      chunk_id: `${email.id}_chk_${chunkIndex++}`,
      email_id: email.id,
      chunk_type: chunkType,
      chunk_reason: chunkReason,
      subject: email.subject,
      sender: email.sender,
      content: p,
      token_count: estimateTokens(p),
      source: email.source || 'enron',
    });
  }

  // 5. Append Signature Chunk if extracted
  if (signatureContent) {
    chunks.push({
      chunk_id: `${email.id}_chk_${chunkIndex++}`,
      email_id: email.id,
      chunk_type: 'signature',
      chunk_reason: 'signature_delimiter',
      subject: email.subject,
      sender: email.sender,
      content: signatureContent,
      token_count: estimateTokens(signatureContent),
      source: email.source || 'enron',
    });
  }

  // 6. Append Quoted Reply Chunk if extracted
  if (quotedReplyContent) {
    chunks.push({
      chunk_id: `${email.id}_chk_${chunkIndex++}`,
      email_id: email.id,
      chunk_type: 'quoted_reply',
      chunk_reason: 'quoted_reply_block',
      subject: email.subject,
      sender: email.sender,
      content: quotedReplyContent,
      token_count: estimateTokens(quotedReplyContent),
      source: email.source || 'enron',
    });
  }

  return chunks;
}
