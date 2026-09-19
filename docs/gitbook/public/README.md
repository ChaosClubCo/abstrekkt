# Abstrekkt

Abstrekkt is the parent brand for a portfolio of AI-native products, engineering systems, and publishing initiatives.

This directory is the **canonical repository source** for the public GitBook space. Only content under `docs/gitbook/public/` is approved for GitBook public synchronization.

Internal repository bindings, agent authority maps, security controls, release evidence, deployment identifiers, operational runbooks, and private customer material are intentionally excluded.

## Operating model

Abstrekkt provides the holding, publishing, and public-facing layer. Loxihart is the operating company for AI enablement, client services, and software execution.

## Documentation principles

- Evidence-backed technical claims
- Clear source and product ownership
- Explicit separation between public documentation and internal operations
- Architecture decisions preserved over time rather than silently rewritten
- Security enforced in runtime controls, not in prose

## Source contract

- Repository: `Krosebrook/abstrekkt`
- Branch: `main`
- GitBook sync root: `docs/gitbook/public`
- Initial sync direction: `GitHub -> GitBook`
- Bidirectional editing: disabled until the mapping/concurrency/rollback acceptance suite passes
