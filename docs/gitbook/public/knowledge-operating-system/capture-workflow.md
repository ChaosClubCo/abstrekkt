# Knowledge Capture Workflow

## Significant system decision

1. Record affected operational entities and relationships in Orbismo.
2. Update GitBook when operators need human-readable guidance.
3. Update Worldkeep when the decision changes the modeled ecosystem or its semantics.
4. Preserve versioned files and change history in GitHub.
5. Let Base44 refresh or project the resulting state rather than inventing a competing copy.

## Provenance minimum

Automated projections should preserve, where practical:

- source system;
- source identifier;
- canonical owner;
- observed timestamp;
- last synchronized timestamp;
- source version or hash;
- synchronization direction;
- conflict policy.

## Security

Never copy passwords, API keys, OAuth tokens, private keys, cookies, recovery codes, or other raw credentials into Orbismo, GitBook, or Worldkeep.
