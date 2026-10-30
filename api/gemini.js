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

  // 토큰 소모를 최소화하기 위해 핵심 JSON 구조만 요구하는 압축 프롬프트
  const prompt = `중학교 3학년 ${subject} 과목 '${topic}' 단원의 내신 대비 객관식 4지선다 3문제를 출제해줘.
난이도는 하, 중, 상(내신 함정 포함) 순서.
추가 API 호출을 막기 위해 오답 시 제공할 소크라테스식 힌트(발로란트 요원 '사이퍼' 말투, 예: "요원, 이 조건을 다시 볼까?")와 핵심 해설을 미리 포함해.
반드시 아래 JSON 배열 포맷으로만 응답해:
[
  {
    "level": "하",
    "q": "문제 내용",
    "options": ["보기1", "보기2", "보기3", "보기4"],
    "ans": 0,
    "hint": "오답 선택 시 사이퍼의 첫 단추 힌트 (1문장)",
    "exp": "정답 맞혔을 때 나오는 핵심 해설 (1~2문장)"
  }
]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            maxOutputTokens: 1200 // 토큰 과다 소모 방지 리미트
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API 호출 오류');
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const questions = JSON.parse(rawText);
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
