// src/gpt.js
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function getGPTResponse(promptText) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '你係一位叫做丞丞嘅奇門遁甲命理師，擅長用八字分析性格特質。請以專業、自然、親切嘅語氣，用中文回答，回應要清楚、詳細、有條理，大約200-300字。'
        },
        {
          role: 'user',
          content: promptText
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error('GPT 回應失敗，請稍後再試');
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
