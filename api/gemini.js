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

  const prompt = `중학교 3학년 ${subject} 과목 '${topic}' 단원의 내신 객관식 4지선다 3문제를 만들어줘.
반드시 아래 JSON 배열 구조만 출력할 것. 다른 텍스트나 설명은 절대 금지.
[
  {
    "level": "하",
    "q": "문제 내용",
    "options": ["1번 보기", "2번 보기", "3번 보기", "4번 보기"],
    "ans": 0,
    "hint": "사이퍼의 힌트 (1문장)",
    "exp": "정답 해설 (1문장)"
  }
]`;

  try {
    // ⚠️ 트래픽 과부하가 없는 가장 안정적인 gemini-1.5-flash 모델로 변경
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.5,
            maxOutputTokens: 1500
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API 호출 오류');
    }

    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const questions = JSON.parse(rawText);
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
