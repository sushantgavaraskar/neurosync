import { z } from 'zod';

const AskSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().min(1).max(20).optional()
});

export async function ask(req, res) {
  const parsed = AskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });
  const { query, topK = 5 } = parsed.data;

  // placeholder – later integrate hybrid retrieval + LLM
  return res.json({ query, topK, answer: 'Coming soon', sources: [] });
}

