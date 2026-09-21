#!/bin/bash

SKILLS=(
  # Go-to-Market Strategy (8)
  "market-segmentation"
  "value-proposition-design"
  "competitive-positioning"
  "pricing-model-design"
  "channel-strategy"
  "partnership-strategy"
  "product-launch-planning"
  "expansion-strategy"
  
  # Product Strategy (6)
  "product-roadmap-planning"
  "feature-prioritization"
  "technical-debt-management"
  "product-analytics-strategy"
  "user-feedback-loops"
  "product-lifecycle-management"
  
  # Customer Success Strategy (6)
  "customer-health-scoring"
  "onboarding-strategy"
  "adoption-playbooks"
  "expansion-playbooks"
  "churn-prevention"
  "customer-advocacy-programs"
)

for skill in "${SKILLS[@]}"; do
  mkdir -p "$skill"/{references,scripts,assets}
done

echo "✅ All 20 strategy skill structures created"
