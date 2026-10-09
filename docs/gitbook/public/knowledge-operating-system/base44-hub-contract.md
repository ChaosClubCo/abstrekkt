# Base44 Hub Contract

The Base44 Hub is the planned unified operator surface for Abstrekkt. Its job is to **control and coordinate** canonical systems, not silently absorb their ownership.

## Responsibilities

The hub may:

- search and display Orbismo entities and relationships;
- open or deep-link GitBook operating documentation;
- render Worldkeep canon views;
- surface GitHub repositories, commits, pull requests, checks, and version information;
- initiate permitted commands against connected systems;
- display synchronization health, provenance, drift, and conflicts;
- launch channel-specific workflows for commerce, publishing, support, automation, and deployment.

## Non-responsibilities

The hub must not:

- store raw integration secrets in ordinary application records;
- become an undocumented second source of truth;
- overwrite upstream canonical values because a cached value is newer locally;
- hide failed writes or synchronization errors;
- treat display aggregation as ownership.

## Adapter contract

Every connected adapter should expose a capability manifest describing read operations, write/command operations, canonical ownership, health state, and provenance metadata.

## Control-plane rule

Commands originate in the hub, but authoritative state remains with the system that owns that domain. The hub records the request and resulting status rather than fabricating success before upstream confirmation.
