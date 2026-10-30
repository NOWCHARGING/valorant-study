// Vercel Serverless Function: receives the same Gemini payload used by index.html.
// Required environment variable: GEMINI_API_KEY
// Optional environment variable: GEMINI_MODEL (defaults to gemini-3-flash-preview)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const body = req.body || {};
  const { contents, systemInstruction, generationConfig } = body;
  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({ error: '요청에 contents가 필요합니다.' });
  }

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          ...(systemInstruction ? { systemInstruction } : {}),
          ...(generationConfig ? { generationConfig } : {})
        })
      }
    );

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: data?.error?.message || `Gemini API HTTP ${upstream.status}`,
        status: upstream.status
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: 'AI 프록시 요청에 실패했습니다.', details: error.message });
  }
}
