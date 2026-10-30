// 파일 경로: api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Vercel에 GEMINI_API_KEY가 설정되지 않았습니다.' });
  }

  // 프론트엔드에서 과목, 단원명과 함께 '난이도(level)'를 추가로 받아옵니다.
  const { subject, topic, level } = req.body;

  // 딱 1문제만 요청하도록 프롬프트를 극도로 다이어트했습니다.
  const prompt = `너는 중학교 3학년 ${subject} 과목 일타 강사야. '${topic}' 단원의 객관식 4지선다 딱 1문제를 출제해.
목표 난이도: ${level}
반드시 아래 JSON 배열 포맷(단 1개의 문제 객체만 포함)으로만 출력할 것. 마크다운(\`\`\`)이나 다른 텍스트는 절대 금지.
[
  {
    "level": "${level}",
    "q": "문제 내용 작성",
    "options": ["보기1", "보기2", "보기3", "보기4"],
    "ans": 0,
    "hint": "사이퍼 요원 컨셉의 뼈때리는 힌트 1줄",
    "exp": "명쾌한 해설 1줄"
  }
]`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7, 
            maxOutputTokens: 600, // 1문제 분량이므로 토큰을 대폭 줄여 출력 속도 극대화
            thinkingConfig: { thinkingBudget: 0 } // 내부 추론 끄기
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'API 오류');
    }

    let rawText = data.candidates[0].content.parts.find(p => !p.thought && p.text)?.text || data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // 1문제만 들어있는 배열을 반환합니다.
    const questions = JSON.parse(rawText);
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
