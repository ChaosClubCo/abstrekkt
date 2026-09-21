#!/usr/bin/env python3
"""
Claude Skill Packager - 2025 Edition
Validates and packages Claude skills into distribution-ready zip files.

Usage:
    python package_skill.py /path/to/skill-directory
    python package_skill.py /path/to/skill-directory --output /path/to/output
    python package_skill.py /path/to/skill-directory --no-validation
"""

import argparse
import os
import re
import sys
import zipfile
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import yaml
except ImportError:
    print("⚠️  PyYAML not found. Install with: pip install pyyaml")
    yaml = None


class SkillPackager:
    """Packages Claude skills following 2025 Anthropic standards."""
    
    def __init__(self, skill_path: str, output_dir: str = None, skip_validation: bool = False):
        self.skill_path = Path(skill_path).resolve()
        self.skill_name = self.skill_path.name
        self.output_dir = Path(output_dir) if output_dir else Path.cwd() / "output"
        self.skip_validation = skip_validation
        self.issues = []
        self.warnings = []
        
    def validate_path(self) -> bool:
        """Validate skill directory exists and has required structure."""
        if not self.skill_path.exists():
            print(f"❌ Error: Directory not found: {self.skill_path}")
            return False
            
        skill_md = self.skill_path / "SKILL.md"
        if not skill_md.exists():
            print(f"❌ Error: SKILL.md not found in {self.skill_path}")
            return False
            
        return True
    
    def extract_frontmatter(self) -> Dict:
        """Extract and validate YAML frontmatter from SKILL.md."""
        skill_md = self.skill_path / "SKILL.md"
        
        with open(skill_md, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract YAML between --- delimiters
        match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
        if not match:
            self.issues.append("❌ No YAML frontmatter found (must start with ---)")
            return {}
        
        if yaml is None:
            self.warnings.append("⚠️  Cannot validate YAML (PyYAML not installed)")
            return {"name": self.skill_name}
        
        try:
            metadata = yaml.safe_load(match.group(1))
        except yaml.YAMLError as e:
            self.issues.append(f"❌ Invalid YAML: {e}")
            return {}
        
        return metadata
    
    def validate_metadata(self, metadata: Dict) -> bool:
        """Validate YAML frontmatter fields."""
        valid = True
        
        # Check required: name
        if 'name' not in metadata:
            self.issues.append("❌ Missing required field: 'name'")
            valid = False
        else:
            name = metadata['name']
            
            # Check name format
            if not re.match(r'^[a-z0-9-]+$', name):
                self.issues.append(f"❌ Name must be lowercase with hyphens only: '{name}'")
                valid = False
            
            if len(name) > 64:
                self.issues.append(f"❌ Name too long ({len(name)} chars, max 64)")
                valid = False
            
            # Check name matches directory
            if name != self.skill_name:
                self.warnings.append(f"⚠️  Name '{name}' doesn't match directory '{self.skill_name}'")
        
        # Check required: description
        if 'description' not in metadata:
            self.issues.append("❌ Missing required field: 'description'")
            valid = False
        else:
            desc = metadata['description']
            
            if len(desc) > 1024:
                self.issues.append(f"❌ Description too long ({len(desc)} chars, max 1024)")
                valid = False
            
            # Check description quality (should mention when to use it)
            if not re.search(r'\b(use|when|for)\b', desc, re.I):
                self.warnings.append("⚠️  Description should mention when to use this skill")
        
        # Check optional: version
        if 'version' in metadata:
            version = metadata['version']
            if not re.match(r'^\d+\.\d+\.\d+', str(version)):
                self.warnings.append(f"⚠️  Version should use semantic versioning (e.g., 1.0.0)")
        else:
            self.warnings.append("⚠️  Consider adding 'version' field for tracking iterations")
        
        return valid
    
    def validate_structure(self) -> None:
        """Validate file structure and check for issues."""
        
        # Check SKILL.md size
        skill_md = self.skill_path / "SKILL.md"
        lines = len(skill_md.read_text(encoding='utf-8').splitlines())
        if lines > 500:
            self.warnings.append(f"⚠️  SKILL.md has {lines} lines (recommend <500 for progressive disclosure)")
        
        # Check for markdown headings in body (should use XML)
        content = skill_md.read_text(encoding='utf-8')
        # Skip frontmatter
        body = re.sub(r'^---\s*\n.*?\n---\s*\n', '', content, flags=re.DOTALL)
        if re.search(r'^#{1,6}\s+', body, re.MULTILINE):
            self.warnings.append("⚠️  Found markdown headings (#) in body - consider using XML tags")
        
        # Check for common directories
        common_dirs = ['workflows', 'references', 'templates', 'scripts']
        found_dirs = [d for d in common_dirs if (self.skill_path / d).exists()]
        
        if found_dirs:
            print(f"ℹ️  Found directories: {', '.join(found_dirs)}")
        
        # Check for secrets patterns
        secret_patterns = [
            r'sk-ant-[a-zA-Z0-9]{48,}',  # Anthropic API keys
            r'api[_-]?key\s*[=:]\s*["\'][\w-]+["\']',
            r'(password|secret|token)\s*[=:]\s*["\'][^"\']+["\']',
        ]
        
        for root, dirs, files in os.walk(self.skill_path):
            # Skip hidden directories
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for file in files:
                if file.startswith('.'):
                    continue
                    
                filepath = Path(root) / file
                try:
                    content = filepath.read_text(encoding='utf-8', errors='ignore')
                    for pattern in secret_patterns:
                        if re.search(pattern, content, re.I):
                            self.issues.append(f"❌ Possible secret detected in {file}")
                            break
                except Exception:
                    pass  # Skip binary or unreadable files
    
    def calculate_size(self) -> float:
        """Calculate total size of skill directory in MB."""
        total = 0
        for root, dirs, files in os.walk(self.skill_path):
            for file in files:
                total += os.path.getsize(os.path.join(root, file))
        return total / (1024 * 1024)
    
    def create_package(self) -> str:
        """Create zip package with proper structure."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        zip_path = self.output_dir / f"{self.skill_name}.zip"
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(self.skill_path):
                # Skip hidden directories and __pycache__
                dirs[:] = [d for d in dirs if not d.startswith('.') and d != '__pycache__']
                
                for file in files:
                    # Skip hidden files and .pyc
                    if file.startswith('.') or file.endswith('.pyc'):
                        continue
                    
                    file_path = Path(root) / file
                    # Archive path includes skill name as top-level folder
                    arcname = self.skill_name / file_path.relative_to(self.skill_path)
                    zipf.write(file_path, arcname)
        
        return str(zip_path)
    
    def verify_package(self, zip_path: str) -> Tuple[bool, str]:
        """Verify the created package is valid."""
        with zipfile.ZipFile(zip_path, 'r') as zipf:
            files = zipf.namelist()
            
            # Check single top-level folder
            top_levels = set(f.split('/')[0] for f in files if '/' in f)
            if len(top_levels) != 1:
                return False, "❌ Zip must have exactly one top-level folder"
            
            top_level = list(top_levels)[0]
            if top_level != self.skill_name:
                return False, f"❌ Top-level folder '{top_level}' doesn't match skill name '{self.skill_name}'"
            
            # Check SKILL.md exists
            skill_md = f"{self.skill_name}/SKILL.md"
            if skill_md not in files:
                return False, f"❌ SKILL.md not found at {skill_md}"
            
            return True, "✓ Package structure valid"
    
    def generate_report(self, zip_path: str, size_mb: float, metadata: Dict) -> str:
        """Generate validation and packaging report."""
        report = []
        report.append("=" * 60)
        report.append("CLAUDE SKILL PACKAGE REPORT")
        report.append("=" * 60)
        report.append("")
        report.append(f"Skill:       {self.skill_name}")
        report.append(f"Version:     {metadata.get('version', 'Not specified')}")
        report.append(f"Size:        {size_mb:.2f} MB")
        report.append(f"Package:     {zip_path}")
        report.append("")
        
        # Validation results
        report.append("VALIDATION RESULTS")
        report.append("-" * 60)
        
        if not self.issues and not self.warnings:
            report.append("✓ All checks passed!")
        
        if self.issues:
            report.append("ERRORS:")
            for issue in self.issues:
                report.append(f"  {issue}")
            report.append("")
        
        if self.warnings:
            report.append("WARNINGS:")
            for warning in self.warnings:
                report.append(f"  {warning}")
            report.append("")
        
        if not self.issues:
            report.append("✓ YAML frontmatter valid")
            report.append("✓ Required fields present")
            report.append("✓ No secrets detected")
            report.append("✓ Package structure valid")
        
        report.append("")
        report.append("INSTALLATION")
        report.append("-" * 60)
        report.append("Claude.ai / Desktop:")
        report.append("  1. Go to Settings → Skills")
        report.append("  2. Click 'Upload Skill'")
        report.append(f"  3. Select {self.skill_name}.zip")
        report.append("")
        report.append("Claude Code:")
        report.append(f"  # Personal (global)")
        report.append(f"  unzip {self.skill_name}.zip -d ~/.claude/skills/")
        report.append("")
        report.append(f"  # Project (local)")
        report.append(f"  unzip {self.skill_name}.zip -d .claude/skills/")
        report.append("")
        report.append("=" * 60)
        
        return "\n".join(report)
    
    def package(self) -> bool:
        """Main packaging workflow."""
        print(f"\n📦 Packaging skill: {self.skill_name}")
        print(f"   Path: {self.skill_path}")
        print()
        
        # Step 1: Validate path
        if not self.validate_path():
            return False
        
        # Step 2: Extract metadata
        metadata = self.extract_frontmatter()
        
        # Step 3: Validate metadata
        if not self.skip_validation:
            if not self.validate_metadata(metadata):
                print("\n❌ Validation failed. Fix errors above.")
                return False
            
            # Step 4: Validate structure
            self.validate_structure()
        
        # Step 5: Calculate size
        size_mb = self.calculate_size()
        if size_mb > 10:
            print(f"⚠️  Large package: {size_mb:.1f}MB (recommend <10MB)")
        
        # Check for blocking issues
        if self.issues and not self.skip_validation:
            print("\n❌ Cannot package due to errors:")
            for issue in self.issues:
                print(f"   {issue}")
            return False
        
        # Step 6: Create package
        print("📦 Creating package...")
        zip_path = self.create_package()
        
        # Step 7: Verify package
        valid, message = self.verify_package(zip_path)
        if not valid:
            print(message)
            return False
        
        # Step 8: Generate report
        report = self.generate_report(zip_path, size_mb, metadata)
        print(report)
        
        # Save report to file
        report_path = self.output_dir / f"{self.skill_name}-report.txt"
        report_path.write_text(report)
        print(f"\n📄 Report saved: {report_path}")
        
        return True


def main():
    parser = argparse.ArgumentParser(
        description="Package Claude skills into distribution-ready zip files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python package_skill.py my-skill/
  python package_skill.py my-skill/ --output ./dist
  python package_skill.py my-skill/ --no-validation
        """
    )
    
    parser.add_argument(
        'skill_path',
        help='Path to skill directory containing SKILL.md'
    )
    
    parser.add_argument(
        '--output', '-o',
        help='Output directory for zip file (default: ./output)',
        default=None
    )
    
    parser.add_argument(
        '--no-validation',
        action='store_true',
        help='Skip validation checks (not recommended)'
    )
    
    args = parser.parse_args()
    
    packager = SkillPackager(
        skill_path=args.skill_path,
        output_dir=args.output,
        skip_validation=args.no_validation
    )
    
    success = packager.package()
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
