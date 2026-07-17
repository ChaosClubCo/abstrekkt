#!/usr/bin/env python3
from pathlib import Path
import json, sys
ROOT = Path(__file__).resolve().parents[1]
required_files = [
 'README.md','PROJECT-KNOWLEDGE-GRAPH.json','DECISIONS-REGISTER.md','TARGET-STATE-BLUEPRINT.md','GAP-REGISTER.md',
 'security/rbac-matrix.md','security/roles.json','security/permissions.sql','database/schema.sql','api/openapi.yaml',
 'product/prd.md','agents/agent-definitions.yaml','prompts/prompt-library.md','operations/incident-response.md','risks/RISK-REGISTER.md','validation/VALIDATION-REPORT.md'
]
required_dirs = ['docs','product','business','ux','design-system','frontend','backend','database','api','agents','prompts','workflows','infrastructure','devops','security','testing','operations','analytics','compliance','research','marketing','archive','adr','risks','validation','repositories','shared']
failures=[]
for rel in required_files:
    p=ROOT/rel
    if not p.exists() or p.stat().st_size==0: failures.append(f'missing-or-empty:{rel}')
for rel in required_dirs:
    p=ROOT/rel
    if not p.exists() or not p.is_dir(): failures.append(f'missing-dir:{rel}')
    elif not any(x.is_file() for x in p.rglob('*')): failures.append(f'empty-dir:{rel}')
for rel in ['PROJECT-KNOWLEDGE-GRAPH.json','SOURCE-REGISTRY.json','MANIFEST.json','security/roles.json']:
    try: json.loads((ROOT/rel).read_text())
    except Exception as e: failures.append(f'invalid-json:{rel}:{e}')
if len(list((ROOT/'adr').glob('ADR-*.md'))) < 10: failures.append('adr-count')
if len(list((ROOT/'risks').glob('RSK-*.md'))) < 20: failures.append('risk-count')
print(json.dumps({"ok": not failures, "critical_failures": len(failures), "failures": failures}, indent=2))
sys.exit(1 if failures else 0)
