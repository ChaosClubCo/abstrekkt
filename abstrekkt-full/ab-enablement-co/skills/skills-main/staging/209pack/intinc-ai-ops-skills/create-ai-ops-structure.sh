#!/bin/bash

SKILLS=(
  # AI Product Management (10)
  "model-selection-frameworks"
  "ai-feature-scoping"
  "ai-roadmap-planning"
  "ai-pricing-strategy"
  "ai-metrics-definition"
  "user-research-ai-products"
  "ai-competitive-intelligence"
  "ai-ethics-governance"
  "ai-risk-assessment"
  "ai-partnership-strategy"
  
  # MLOps & Engineering (15)
  "model-training-pipelines"
  "model-versioning-registry"
  "model-deployment-workflows"
  "model-monitoring-drift"
  "prompt-engineering-workflows"
  "rag-system-design"
  "model-fine-tuning-workflows"
  "llm-evaluation-frameworks"
  "ai-cost-optimization"
  "multi-model-orchestration"
  "ai-observability"
  "vector-database-optimization"
  "ai-caching-strategies"
  "ai-rate-limiting"
  "ai-testing-strategies"
  
  # AI Governance & Safety (10)
  "ai-bias-detection"
  "ai-safety-testing"
  "ai-explainability"
  "ai-content-moderation"
  "ai-abuse-prevention"
  "ai-ethics-reviews"
  "ai-transparency-reporting"
  "ai-incident-response"
  "ai-policy-enforcement"
  "ai-audit-trails"
  
  # AI Customer Enablement (5)
  "prompt-engineering-training"
  "ai-best-practices-guides"
  "ai-integration-tutorials"
  "ai-performance-optimization"
  "ai-troubleshooting-guides"
)

for skill in "${SKILLS[@]}"; do
  mkdir -p "$skill"/{references,scripts,assets}
  echo "Created: $skill"
done

echo "✅ All 30 AI Ops skill structures created"
