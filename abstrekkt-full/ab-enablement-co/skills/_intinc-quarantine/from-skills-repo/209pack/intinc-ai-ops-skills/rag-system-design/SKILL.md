---
name: rag-system-design
description: Design retrieval-augmented generation systems with chunking, embeddings, and vector search. Use when building document Q&A, knowledge bases, or semantic search. Triggers on: RAG system, document qa, vector search, embeddings, knowledge base, retrieval.
version: 1.0.0
allowed-tools: Read, Write, Bash
license: MIT
---

# Rag System Design

## Purpose
Architect production-grade RAG systems for enterprise knowledge management.

## When to Use
Building chat-with-docs feature, enterprise search, AI assistant with private knowledge, compliance-required citations.

## Core Workflow

1. Data Ingestion (extract text from docs, clean/normalize, handle formats)
2. Chunking Strategy (500-1000 tokens, 100 token overlap, preserve context)
3. Embedding (OpenAI text-embedding-3-small for cost, choose vector DB: Pinecone/Qdrant)
4. Retrieval (top-k similarity search, reranking with cross-encoder)
5. Generation (LLM with retrieved context, citation extraction, confidence scoring)

## Output Format
- Architecture diagrams (Mermaid)
- Implementation guides (Markdown)
- Code examples (Python/TypeScript)
- Cost estimates (CSV/Excel)

## Dependencies
- Foundational skill (no IntInc skill dependencies)

## License
MIT License - See LICENSE.txt
