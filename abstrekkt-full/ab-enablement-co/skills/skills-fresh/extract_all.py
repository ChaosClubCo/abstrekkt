import os
import tarfile

base = r'D:\03_Development\Skills\Claude-skills-plugins-and-more'

for f in os.listdir(base):
    if f.endswith('.tar.gz'):
        dest = os.path.join(base, f.replace('.tar.gz', ''))
        os.makedirs(dest, exist_ok=True)
        with tarfile.open(os.path.join(base, f)) as tf:
            tf.extractall(dest)
        print(f'Extracted: {f} -> {dest}')

print('\n=== FULL FILE TREE ===')
for root, dirs, files in os.walk(base):
    level = root.replace(base, '').count(os.sep)
    indent = '  ' * level
    print(f'{indent}{os.path.basename(root)}/')
    subindent = '  ' * (level + 1)
    for fn in files:
        if not fn.endswith('.tar.gz'):
            sz = os.path.getsize(os.path.join(root, fn))
            print(f'{subindent}{fn}  ({sz:,} bytes)')
