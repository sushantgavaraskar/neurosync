export async function search(req, res) {
  const q = String(req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'missing_q' });
  // placeholder – later call vector DB
  return res.json({ query: q, results: [] });
}

