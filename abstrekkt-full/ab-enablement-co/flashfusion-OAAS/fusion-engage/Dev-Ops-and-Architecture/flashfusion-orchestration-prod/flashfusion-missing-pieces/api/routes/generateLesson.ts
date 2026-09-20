import { Router } from 'express';
import { z } from 'zod';

const router = Router();
const Body = z.object({
  topic: z.string().min(2),
  level: z.string().min(2)
});

router.post('/', (req, res) => {
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid body', issues: parsed.error.issues });
  const { topic, level } = parsed.data;

  const lesson = {
    topic,
    level,
    objectives: [
      `Define key terms for ${topic}`,
      `Explain core process of ${topic}`
    ],
    activities: [
      { type: 'discussion', prompt: `Think-Pair-Share on ${topic}` },
      { type: 'worksheet', items: 10 }
    ],
    standards: ['CCSS.ELA-LITERACY.RST.6-8.1']
  };
  res.json(lesson);
});

export default router;
