import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text, products } = await req.json()

  if (!text || !products) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const productList = products.map((p: { name: string; unit: string }) => `- ${p.name} (unité: ${p.unit})`).join('\n')

  const prompt = `Tu es un assistant pour une épicerie marocaine.
L'utilisateur décrit sa liste de courses en français, arabe ou darija.

Voici les produits disponibles dans le catalogue :
${productList}

Liste de courses de l'utilisateur : "${text}"

Retourne UNIQUEMENT un JSON valide (sans markdown, sans explication) avec ce format exact :
[{"name": "nom exact du produit du catalogue", "quantity": nombre}]

Règles :
- Utilise UNIQUEMENT des produits qui existent dans le catalogue ci-dessus
- Si un produit demandé n'existe pas, ignore-le
- La quantité doit être un nombre (ex: 2, 0.5, 1)
- Si aucune quantité précisée, mets 1
- Retourne un tableau vide [] si rien ne correspond`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 500,
    }),
  })

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content ?? '[]'

  try {
    const parsed = JSON.parse(content)
    return NextResponse.json({ items: parsed })
  } catch {
    return NextResponse.json({ items: [] })
  }
}
