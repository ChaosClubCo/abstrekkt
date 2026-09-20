# Deployment Topology

```mermaid
graph LR
Browser-->CDN-->Frontend-->API
API-->Postgres
API-->Queue
API-->ObjectStorage
Queue-->Worker
Worker-->ModelGateway
Worker-->Postgres
Worker-->ObjectStorage
```
