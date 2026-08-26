from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
required = [
  'README.md','TARGET-STATE-BLUEPRINT.md','DECISIONS-REGISTER.md','PROJECT-KNOWLEDGE-GRAPH.json',
  'research/RISK-REGISTER.md','product/prd.md','business/pricing.md','database/schema.sql',
  'security/rbac-matrix.md','api/openapi.yaml','agents/agent-catalog.md','prompts/system-prompt-library.md',
  'testing/validation-report.md','operations/weekly-business-review.md'
]
missing = [p for p in required if not (ROOT / p).exists()]
empty_dirs = [str(p.relative_to(ROOT)) for p in ROOT.rglob('*') if p.is_dir() and not any(p.iterdir())]
if missing or empty_dirs:
    print(json.dumps({'ok': False, 'missing': missing, 'empty_dirs': empty_dirs}, indent=2))
    sys.exit(1)
print(json.dumps({'ok': True, 'required_files': len(required), 'empty_dirs': 0}, indent=2))
