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

  // 불필요한 서술을 막고 단답형으로 빠르게 생성하도록 지시
  const prompt = `중3 ${subject} '${topic}' 단원 객관식 4지선다 3문제(난이도 하,중,상).
각 항목은 1문장 이내로 아주 짧게 작성해.
반드시 아래 JSON 배열만 출력해:
[{"level":"하","q":"문제","options":["보기1","보기2","보기3","보기4"],"ans":0,"hint":"사이퍼 말투 짧은 힌트","exp":"핵심 한줄 해설"}]`;

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
            temperature: 0.2,
            maxOutputTokens: 1200,
            // ⚡ 속도 향상의 핵심: 내부 생각(Thinking) 과정을 꺼서 30초 지연을 2~3초로 단축!
            thinkingConfig: {
              thinkingBudget: 0
            }
          }
        })
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API 호출 오류');
    }

    // 추론 텍스트가 섞여 있을 경우를 대비해 실제 답변 파트만 추출
    const parts = data.candidates[0].content.parts;
    const textPart = parts.find(p => !p.thought && p.text) || parts[parts.length - 1];
    let rawText = textPart.text;

    // 순수 JSON 대괄호 [ ... ] 영역만 안전하게 추출 (파싱 에러 원천 차단)
    const startIdx = rawText.indexOf('[');
    const endIdx = rawText.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
      rawText = rawText.substring(startIdx, endIdx + 1);
    }

    const questions = JSON.parse(rawText);
    return res.status(200).json({ questions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
