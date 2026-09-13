# Recovery and Conflict Resolution

## Failure classes

### Projection drift
A downstream view no longer matches its canonical source.

**Response:** re-read the canonical source and rebuild the projection. Do not patch the projection as though it were authoritative.

### Conflicting writable copies
Two systems contain different values for a field both believe they own.

**Response:** stop automated writes for that field, identify the intended owner, preserve both observations, and resolve deliberately.

### Missing provenance
A value exists but its origin cannot be established.

**Response:** classify it as unverified until corroborated. Do not silently promote it to canonical state.

### Compromised credential
A secret was copied into a documentation or graph surface.

**Response:** revoke/rotate the credential first, remove exposed copies second, then audit history and downstream caches.

Git history provides durable recovery for versioned GitBook and Worldkeep artifacts. Operational stores should maintain their own audit trails or lifecycle history rather than relying on Git as a substitute.
