import { Router } from 'express';

const router = Router();
router.post('/', (_req, res) => {
  // In production: verify signature and update credits
  res.json({ received: true });
});
export default router;
