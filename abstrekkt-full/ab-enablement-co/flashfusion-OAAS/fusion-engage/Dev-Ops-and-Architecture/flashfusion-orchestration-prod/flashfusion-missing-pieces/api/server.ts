import express from 'express';
import cors from 'cors';
import { json } from 'express';
import lessonRouter from './routes/generateLesson.js';
import cardsRouter from './routes/generateFlashcards.js';
import stripeWebhook from './routes/stripeWebhook.js';

const app = express();
app.use(cors());
app.use(json({ type: ['application/json','application/*+json'] }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api/generate/lesson', lessonRouter);
app.use('/api/generate/flashcards', cardsRouter);
app.use('/api/stripe/webhook', stripeWebhook);

const port = Number(process.env.PORT || 5173);
app.listen(port, () => console.log(`API on :${port}`));
