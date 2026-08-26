# Dependency Map

    _Generated: 2026-06-21. Reconstruction confidence is bounded by accessible project memory/context and the current chat session._


## Dependency Rules

`shared-packages` can be imported by every repository. `flashfusion-core` can call `flashfusion-agents` through typed API contracts, not by importing runtime internals. `flashfusion-consulting` consumes templates and schemas. `flashfusion-commerce` and `flashfusion-studio` consume UI/design packages but should not block revenue delivery.
