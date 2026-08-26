import os
import shutil

dest_base = r'C:\Users\kyler\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\8fb47a09-919b-43db-bf8f-513a2818df50\4bb5b8d5-6105-4825-9c6d-3fd298e2d95f\skills'

# Skills to create with their SKILL.md content source
# We'll read from the mnt outputs that the Linux VM wrote
source_base = r'D:\03_Development\Skills\phantom-skills'

skills = [
    'security-implementer',
    'security-reviewer',
    'security-auditor',
    'security-deployer',
    'approval-protocol',
    'secret-detection',
    'sbom-generation',
]

for skill in skills:
    src = os.path.join(source_base, skill, 'SKILL.md')
    dest_dir = os.path.join(dest_base, skill)
    dest = os.path.join(dest_dir, 'SKILL.md')

    if os.path.exists(src):
        os.makedirs(dest_dir, exist_ok=True)
        shutil.copy2(src, dest)
        sz = os.path.getsize(dest)
        print(f'  OK: {skill}/SKILL.md ({sz:,} bytes)')
    else:
        print(f'  MISSING SOURCE: {src}')

total = len([d for d in os.listdir(dest_base) if os.path.isdir(os.path.join(dest_base, d))])
print(f'\nTotal skills in directory: {total}')
