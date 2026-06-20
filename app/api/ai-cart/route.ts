import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, imageBase64 } = await req.json()

  if (!text && !imageBase64) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })

  const messages = imageBase64
    ? [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: `This is a grocery list or shopping note. Extract all items and quantities you can read.
Return ONLY valid JSON array, no markdown, no explanation.
Format: [{"name": "item name in french", "quantity": number}]
- Default quantity is 1 if not specified
- Translate everything to french
- Include all readable items even if partially visible`,
            },
          ],
        },
      ]
    : [
        {
          role: 'user',
          content: `Extract grocery items and quantities from this text. Return ONLY valid JSON array, no markdown, no explanation.
Text: "${text}"
Format: [{"name": "item name", "quantity": number}]
- quantity default is 1 if not specified
- translate to french if needed`,
        },
      ]

  const model = imageBase64 ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.3-70b-versatile'

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: 0, max_tokens: 500 }),
  })

  const data = await response.json()
  console.log('Groq response:', JSON.stringify(data).slice(0, 300))
  const content = data.choices?.[0]?.message?.content ?? '[]'

  try {
    const parsed = JSON.parse(content)
    return NextResponse.json({ items: parsed })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
