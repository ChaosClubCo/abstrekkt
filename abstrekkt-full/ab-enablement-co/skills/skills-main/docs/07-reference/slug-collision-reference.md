# Slug Collision Reference

When two skills in different categories share the same directory name (slug), a collision occurs. The pipeline resolves collisions by applying a dedup prefix.

---

## The Dedup Prefix Pattern

When `discover_all_skills()` in `lib/skill_parser.py` detects that the same slug appears in more than one category, it prefixes all colliding slugs with their category name:

```
{category}--{slug}
```

For example, if `packaging-design` exists in both `ai-agents/` and `creative/`, the output slugs become:

- `ai-agents--packaging-design`
- `creative--packaging-design`

This prefix is applied in platform outputs (gems, Codex JSON, Copilot markdown, CLI skills, bundles). The master skill directories themselves are not renamed.

### Implementation

In `lib/skill_parser.py`, the `discover_all_skills()` function uses two detection methods:

1. **Type 1 (known groups):** A hardcoded frozenset `_SLUG_COLLISION_GROUPS` lists known collisions. Any slug in this set automatically receives the dedup prefix.
2. **Type 2 (dynamic detection):** A `Counter` tallies all slugs. Any slug appearing more than once gets the dedup prefix, catching both known and previously unknown collisions.

```python
from collections import Counter
slug_counts = Counter(s["slug"] for s in skills)
for skill in skills:
    slug = skill["slug"]
    category = skill["category"]
    if slug in _SLUG_COLLISION_GROUPS:
        skill["_dedup_slug"] = f"{category}--{slug}"
    elif slug_counts[slug] > 1:
        skill["_dedup_slug"] = f"{category}--{slug}"
```

Use `get_effective_slug(skill)` from `lib/skill_parser.py` to retrieve the dedup slug (if present) or the original slug.

---

## The 5 Collision Groups

These are the known slug collisions as of February 2026:

### 1. packaging-design

| Category | Master Path |
|----------|------------|
| ai-agents | `_master-skills/ai-agents/packaging-design/SKILL.md` |
| creative | `_master-skills/creative/packaging-design/SKILL.md` |

Output slugs: `ai-agents--packaging-design`, `creative--packaging-design`

### 2. podcast-production

| Category | Master Path |
|----------|------------|
| ai-agents | `_master-skills/ai-agents/podcast-production/SKILL.md` |
| creative | `_master-skills/creative/podcast-production/SKILL.md` |

Output slugs: `ai-agents--podcast-production`, `creative--podcast-production`

### 3. presentation-design

| Category | Master Path |
|----------|------------|
| ai-agents | `_master-skills/ai-agents/presentation-design/SKILL.md` |
| creative | `_master-skills/creative/presentation-design/SKILL.md` |

Output slugs: `ai-agents--presentation-design`, `creative--presentation-design`

### 4. vendor-management

| Category | Master Path |
|----------|------------|
| strategy | `_master-skills/strategy/vendor-management/SKILL.md` |
| operations | `_master-skills/operations/vendor-management/SKILL.md` |

Output slugs: `strategy--vendor-management`, `operations--vendor-management`

### 5. inventory-management

| Category | Master Path |
|----------|------------|
| ai-agents | `_master-skills/ai-agents/inventory-management/SKILL.md` |
| operations | `_master-skills/operations/inventory-management/SKILL.md` |

Output slugs: `ai-agents--inventory-management`, `operations--inventory-management`

---

## How to Check for New Collisions

After adding new skills, check for collisions:

```bash
find _master-skills -maxdepth 2 -mindepth 2 -type d -printf "%f\n" | sort | uniq -d
```

Any output indicates a collision. The pipeline handles collisions automatically via the dedup prefix, but you should be aware of them for documentation and debugging purposes.

---

## Historical Context

An earlier version of the pipeline used `slugify(frontmatter_name)` instead of the directory name to derive slugs. This caused approximately 13 skills to overwrite each other silently during conversion (Type 1 collisions). The fix was to use `file_path.parent.name` (the directory name) as the canonical slug.

Cross-category collisions (Type 2) are handled by the `{category}--{slug}` dedup prefix described above.

---

## Avoiding New Collisions

When adding a new skill, check if the slug already exists in another category:

```bash
find _master-skills -maxdepth 2 -type d -name "your-new-slug"
```

If a match exists, you have three options:

1. **Choose a different slug** -- the simplest solution. Make the name more specific (e.g., `ai-podcast-production` instead of `podcast-production`).
2. **Accept the collision** -- the pipeline handles it automatically with dedup prefixes. Both skills will work, but their output slugs will include the category prefix.
3. **Consolidate** -- if the two skills are genuinely the same, merge them into one and place it in the most appropriate category.

---

## Related Documents

- [Skill Management](../06-admin-guide/skill-management.md) -- adding skills and checking for collisions
- [Pipeline Operations](../06-admin-guide/pipeline-operations.md) -- how discover_all_skills() works
- [Glossary](glossary.md) -- definitions of slug, dedup prefix, collision group
