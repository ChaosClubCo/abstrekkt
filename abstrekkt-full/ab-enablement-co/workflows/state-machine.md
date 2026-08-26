# Reconstruction State Machine

```mermaid
stateDiagram-v2
  [*] --> Draft
  Draft --> SourcesImported
  SourcesImported --> Extracting
  Extracting --> GraphReady
  GraphReady --> DecisionsReady
  DecisionsReady --> GapsResolved
  GapsResolved --> Validating
  Validating --> ExportReady: no critical failures
  Validating --> RemediationRequired: critical failures
  RemediationRequired --> GapsResolved
```
