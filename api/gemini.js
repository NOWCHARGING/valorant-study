// 파일 경로: api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Vercel에 GEMINI_API_KEY가 설정되지 않았습니다.' });
  }

  const { subject, topic } = req.body;

  const prompt = `중학교 3학년 ${subject} 과목 '${topic}' 단원의 내신 대비 객관식 4지선다 3문제를 출제해줘.
난이도는 하, 중, 상(내신 함정 포함) 순서.
오답 시 제공할 소크라테스식 힌트(발로란트 요원 '사이퍼' 말투, 예: "요원, 이 조건을 다시 볼까?")와 핵심 해설을 포함해.
반드시 다른 설명 없이 순수한 JSON 배열 포맷( [ { ... } ] )으로만 응답해. 마크다운 백틱(\`\`\` 등)도 절대 붙이지 마.`;

  try {
    const response = await fetch(
      `[https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=$){apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 1200
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API 호출 오류');
    }

    let rawText = data.candidates[0].content.parts[0].text;
    
    // 혹시라도 AI가 마크다운 코드 블록(```json ... ```)을 포함해서 보냈을 경우를 대비한 안전 필터
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(rawText);
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
