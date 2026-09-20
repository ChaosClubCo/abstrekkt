# Creating Bundles

This guide walks you through creating a new custom bundle from scratch. A bundle is a curated subset of the Skills Library packaged for a specific audience, role, or deployment context.

---

## Prerequisites

- Python 3.10 or later
- The Skills Library repository cloned locally
- Familiarity with the `_master-skills/` directory structure
- `PYTHONIOENCODING=utf-8` set in your environment (required on Windows)

---

## Bundle Creation Process

Creating a bundle involves six steps:

1. Define the bundle's purpose and audience
2. Select skills that match the criteria
3. Create the bundle directory
4. Configure the bundle in `populate_all.py`
5. Generate the bundle
6. Test and deploy

---

## Step 1: Define Purpose and Audience

Before selecting skills, answer these questions:

- **Who is the audience?** (e.g., security engineers, frontend developers, data scientists)
- **What platform will they use?** (Gemini, Copilot, or Codex)
- **How many skills should the bundle include?** (15--80 is typical; fewer is better for focus)
- **What is the bundle name?** (use kebab-case, e.g., `security-auditor-25`)

Write a one-sentence description of the bundle:

> "A set of 10 security-focused skills for engineers performing security audits, penetration testing, and compliance reviews."

---

## Step 2: Select Skills

Browse `_master-skills/` to find skills that match your criteria. You can search by category, by name, or by reading the YAML frontmatter.

### Finding Skills by Category

```bash
# List all skills in a category
ls _master-skills/technical/
ls _master-skills/ai-agents/
ls _master-skills/operations/
```

### Finding Skills by Keyword

```bash
# Search for skills with "security" in the name or description
grep -rl "security" _master-skills/ --include="SKILL.md" | head -20
```

### Validating a Skill Exists

```bash
# Check that a specific skill directory exists
ls _master-skills/technical/defense-in-depth/SKILL.md
ls _master-skills/technical/vulnerability-management/SKILL.md
```

### Creating the Skill List

Write down the slugs (directory names) of all skills you want to include. For our Security Auditor example:

```
defense-in-depth
vulnerability-management
penetration-testing
incident-response
sast-configuration
secrets-management
k8s-security-policies
pci-compliance
hipaa-compliance
security-scanning-framework
```

Verify each slug exists:

```bash
for slug in defense-in-depth vulnerability-management penetration-testing \
  incident-response sast-configuration secrets-management \
  k8s-security-policies pci-compliance hipaa-compliance \
  security-scanning-framework; do
  found=$(find _master-skills -type d -name "$slug" 2>/dev/null | head -1)
  if [ -z "$found" ]; then
    echo "NOT FOUND: $slug"
  else
    echo "OK: $found"
  fi
done
```

---

## Step 3: Create the Bundle Directory

Create the directory under the appropriate platform's `bundles/` folder:

```bash
# For a Gemini bundle
mkdir -p GeminiSkills/bundles/security-auditor-10/

# For a Copilot bundle
mkdir -p CopilotSkills/bundles/security-auditor-10/

# For a Codex bundle
mkdir -p CodexSkills/bundles/security-auditor-10/
```

---

## Step 4: Configure in populate_all.py

Open `populate_all.py` and add your bundle definition to the appropriate platform's bundle configuration. The exact location and format depends on how the script defines bundles, but the pattern is consistent.

### Locating the Bundle Definitions

Search for existing bundle definitions to find the right section:

```bash
grep -n "vertex-enterprise\|studio-essential\|agent-chains" populate_all.py | head -10
```

### Adding the Definition

Add your bundle to the bundle definitions. The typical structure is a dictionary entry with:

- `name` -- Bundle directory name (matches the directory you created)
- `description` -- One-line description
- `platform` -- Target platform
- `skills` -- List of skill slugs to include
- `format` -- Output format (e.g., "gem-json", "custom-instructions", "responses-api")

Example (the exact syntax depends on the script's bundle definition format):

```python
{
    "name": "security-auditor-10",
    "description": "Security audit, penetration testing, and compliance skills",
    "platform": "gemini",
    "skills": [
        "defense-in-depth",
        "vulnerability-management",
        "penetration-testing",
        "incident-response",
        "sast-configuration",
        "secrets-management",
        "k8s-security-policies",
        "pci-compliance",
        "hipaa-compliance",
        "security-scanning-framework",
    ],
    "format": "gem-json",
}
```

---

## Step 5: Generate the Bundle

Run the populate script to generate your bundle:

```bash
export PYTHONIOENCODING=utf-8
python populate_all.py --phase bundles
```

This will process all bundle definitions, including your new one. The script:

1. Reads each bundle definition
2. Locates the master SKILL.md for each slug
3. Converts it to the platform-native format
4. Copies it into the bundle directory

### Verifying the Output

```bash
# Check that the bundle was created with the right number of files
ls GeminiSkills/bundles/security-auditor-10/ | wc -l
# Expected: 10

# Spot-check a file
cat GeminiSkills/bundles/security-auditor-10/defense-in-depth.json | head -20
```

---

## Step 6: Test and Deploy

### Validation

Run the skill validator on each skill in the bundle to ensure quality:

```bash
for file in GeminiSkills/bundles/security-auditor-10/*.json; do
  echo "Validating: $file"
  python lib/skill_validator.py "$file"
done
```

### Deployment

Deploy the bundle using the standard platform deployment commands:

```bash
# Gemini
cp -r GeminiSkills/bundles/security-auditor-10/ ~/.gemini/gems/

# Copilot
cp -r CopilotSkills/bundles/security-auditor-10/ .github/copilot-instructions/

# Codex
cp -r CodexSkills/bundles/security-auditor-10/ ~/.codex/skills/
```

### Smoke Test

After deploying, verify the skills are accessible:

1. Open your AI platform
2. Ask a question that should invoke one of the bundled skills (e.g., "How should I perform a penetration test on our API?")
3. Confirm the response reflects the skill's guidance

---

## Walkthrough: Security Auditor Bundle

Here is the complete end-to-end process for creating a "Security Auditor" bundle with 10 skills for the Gemini platform.

### 1. Define

- **Audience:** Security engineers and auditors
- **Platform:** Gemini
- **Size:** 10 skills
- **Name:** `security-auditor-10`
- **Description:** Security audit, penetration testing, and compliance skills

### 2. Select Skills

After browsing `_master-skills/`, we select:

| Slug | Category | Purpose |
|------|----------|---------|
| defense-in-depth | technical | Layered security architecture |
| vulnerability-management | technical | Vulnerability tracking and remediation |
| penetration-testing | technical | Penetration testing methodology |
| incident-response | operations | Incident response procedures |
| sast-configuration | technical | Static application security testing |
| secrets-management | technical | Secrets and credential management |
| k8s-security-policies | technical | Kubernetes security hardening |
| pci-compliance | industry | PCI DSS compliance |
| hipaa-compliance | industry | HIPAA compliance |
| security-scanning-framework | technical | Security scanning automation |

### 3. Create Directory

```bash
mkdir -p GeminiSkills/bundles/security-auditor-10/
```

### 4. Configure

Add the bundle definition to `populate_all.py` as shown in Step 4 above.

### 5. Generate

```bash
export PYTHONIOENCODING=utf-8
python populate_all.py --phase bundles
```

### 6. Verify

```bash
ls GeminiSkills/bundles/security-auditor-10/
# Expected output:
# defense-in-depth.json
# hipaa-compliance.json
# incident-response.json
# k8s-security-policies.json
# pci-compliance.json
# penetration-testing.json
# sast-configuration.json
# secrets-management.json
# security-scanning-framework.json
# vulnerability-management.json

ls GeminiSkills/bundles/security-auditor-10/ | wc -l
# Expected: 10
```

### 7. Deploy

```bash
cp -r GeminiSkills/bundles/security-auditor-10/ ~/.gemini/gems/
```

---

## Tips for Good Bundles

- **Keep bundles focused.** A bundle of 15--30 skills with a clear theme is more useful than a vague collection of 100.
- **Minimize overlap.** If two skills cover very similar ground, pick the more comprehensive one.
- **Test with real tasks.** After deploying, try 5--10 real prompts to see if the bundle covers the expected use cases.
- **Document your bundle.** Add a README.md to the bundle directory explaining who it is for and what it contains.
- **Watch for slug collisions.** Five skills have cross-category collisions (packaging-design, podcast-production, presentation-design, vendor-management, inventory-management). If your bundle includes any of these, use the `{category}--{slug}` dedup prefix.

---

## Related Pages

- [Bundle Catalog](./bundle-catalog.md) -- All 18 bundles
- [Tutorial: Create a Bundle](../09-tutorials/04-create-a-bundle.md) -- Step-by-step tutorial with a Frontend Developer example
- [Admin Guide](../06-admin-guide/) -- Pipeline operations
- [Reference](../07-reference/) -- Script configuration details
