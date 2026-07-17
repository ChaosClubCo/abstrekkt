# Platform-Specific Fixes

## Windows

### Path Length Limit (260 characters)

**Symptom:** "Path too long", "Location is not available"

**Fix 1: Shorten the path**
```
Before: C:\Users\username\Documents\My Projects\Work\Skills\my-skill-name-v2-final\
After:  C:\skills\my-skill\
Savings: ~70 characters
```

**Fix 2: Enable long paths (Windows 10+)**
```powershell
# Run PowerShell as Administrator
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```
Requires restart.

### Reserved Filenames

Windows prohibits these names: CON, PRN, AUX, NUL, COM1-9, LPT1-9

```
Bad:  CON.md, PRN.md, AUX.md
Good: console.md, printer.md, auxiliary.md
```

### Creating Zips on Windows

```powershell
# PowerShell (built-in)
Compress-Archive -Path .\my-skill\ -DestinationPath my-skill.zip

# Validate
Expand-Archive -Path my-skill.zip -DestinationPath test\
dir test\
```

Avoid using Windows Explorer "Send to → Compressed folder" — it sometimes produces zips with incorrect internal paths.

---

## macOS

### .DS_Store Files

macOS creates hidden `.DS_Store` files in every folder. These clutter skill packs.

```bash
# Remove before zipping
find my-skill/ -name '.DS_Store' -delete

# Create clean zip (exclude hidden files and macOS metadata)
zip -r -X my-skill.zip my-skill/ -x "*/.*" -x "*/__MACOSX/*"
```

### Resource Forks

Older macOS versions create `__MACOSX/` directories inside zips.

```bash
# Create zip without resource forks
cd my-skill/
zip -r -X ../my-skill.zip . -x ".*" -x "__MACOSX/*"
cd ..
```

### Validate
```bash
unzip -l my-skill.zip
# Should show only skill files, no .DS_Store or __MACOSX
```

---

## Linux

### Permissions

Ensure files are readable:
```bash
chmod -R 644 my-skill/
chmod -R 755 my-skill/scripts/  # If scripts need to be executable
```

### Hidden Files

```bash
# Zip without hidden files
zip -r my-skill.zip my-skill/ -x "*/.*"
```

### Symbolic Links

Zips don't handle symlinks well. Replace with actual files:
```bash
# Find symlinks
find my-skill/ -type l

# Replace symlinks with actual files
find my-skill/ -type l -exec sh -c 'cp --remove-destination "$(readlink -f "$0")" "$0"' {} \;
```

### Validate
```bash
# Test zip integrity
unzip -t my-skill.zip

# List contents
unzip -l my-skill.zip
```

---

## Cross-Platform Prevention

1. **Use Python for zipping** — consistent behavior across all platforms:
   ```python
   import zipfile
   from pathlib import Path

   with zipfile.ZipFile('my-skill.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
       for file in Path('my-skill').rglob('*'):
           if file.is_file() and not file.name.startswith('.'):
               zipf.write(file, file.relative_to(Path('my-skill').parent))
   ```

2. **Store skills in short paths** — `C:\skills\` or `~/skills/`
3. **No special characters** — letters, digits, hyphens only
4. **Validate before uploading** — run `scripts/diagnose.py` on every skill pack before attempting upload
