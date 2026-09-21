import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { randomUUID, createHash } from 'node:crypto';
import { CreateProjectRequestSchema, CreateSourceRequestSchema, type KnowledgeGraph } from '@memoir/shared';

export function buildServer() {
  const app = Fastify({ logger: true });
  app.register(helmet);
  app.register(cors, { origin: false });
  const projects = new Map<string, { id: string; name: string; createdAt: string }>();
  const sources = new Map<string, Array<{ id: string; title: string; sha256: string }>>();

  app.get('/health', async () => ({ ok: true, service: 'memoir-api', version: '0.1.0' }));
  app.post('/v1/projects', async (request, reply) => {
    const parsed = CreateProjectRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: { code: 'VALIDATION_FAILED', details: parsed.error.issues } });
    const project = { id: randomUUID(), name: parsed.data.name, createdAt: new Date().toISOString() };
    projects.set(project.id, project); sources.set(project.id, []);
    return reply.code(201).send(project);
  });
  app.get('/v1/projects', async () => ({ projects: Array.from(projects.values()) }));
  app.post('/v1/projects/:projectId/sources', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    if (!projects.has(projectId)) return reply.code(404).send({ error: { code: 'NOT_FOUND' } });
    const parsed = CreateSourceRequestSchema.safeParse(request.body);
    if (!parsed.success) return reply.code(400).send({ error: { code: 'VALIDATION_FAILED', details: parsed.error.issues } });
    const sha256 = createHash('sha256').update(parsed.data.content).digest('hex');
    sources.get(projectId)!.push({ id: randomUUID(), title: parsed.data.title, sha256 });
    return reply.code(202).send({ status: 'queued', sha256 });
  });
  app.get('/v1/projects/:projectId/knowledge-graph', async (request, reply) => {
    const { projectId } = request.params as { projectId: string };
    const project = projects.get(projectId);
    if (!project) return reply.code(404).send({ error: { code: 'NOT_FOUND' } });
    const graph: KnowledgeGraph = { nodes: [{ id: project.id, type: 'project', label: project.name, confidence: 'VERIFIED', sourceIds: [] }], edges: [] };
    return graph;
  });
  return app;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildServer().listen({ port: Number(process.env.PORT ?? 3001), host: '0.0.0.0' }).catch((error) => { console.error(error); process.exit(1); });
}
