# Agent: Skills Gap Detector Agent

## Purpose
After an audit scorecard is submitted, automatically identify which skill packs address the identified gaps and generate a prioritized recommendation.

## Trigger
Audit scorecard processor completes (downstream of Agent 03)

## Inputs
- Completed audit analysis
- Gap severity list

## Steps
1. Receive audit analysis from Agent 03
2. Map each identified gap to relevant skill packs
3. Score each skill pack: (gap severity × ICP fit × deployment effort)
4. Claude: Generate top 5 skill pack recommendations with justification
5. Append recommendations to the audit report in Notion
6. Add "Skill Pack Recommendations" section to proposal draft if exists

## Output
- Skills gap analysis appended to audit report
- Prioritized recommendation list (top 5 with justification)

## Human Gate
Recommendations are advisory — Kyle decides final skill selection with client.

## Platform
n8n + Claude API + Notion MCP
