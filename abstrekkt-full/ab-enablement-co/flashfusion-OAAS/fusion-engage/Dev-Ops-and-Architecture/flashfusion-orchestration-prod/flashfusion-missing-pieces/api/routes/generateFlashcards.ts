import { Router } from 'express';
import { z } from 'zod';

const router = Router();
const Body = z.object({ topic: z.string().min(2), level: z.string().optional() });

router.post('/', (req, res) => {
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body', issues: parsed.error.issues });
  const { topic } = parsed.data;
  const cards = [
    { q: `${topic}: key term 1?`, a: 'Definition 1' },
    { q: `${topic}: key term 2?`, a: 'Definition 2' }
  ];
  res.json({ topic, cards });
});

export default router;
