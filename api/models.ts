import type { VercelRequest, VercelResponse } from '@vercel/node'

// 開発用：利用可能なGeminiモデルを確認するエンドポイント
// 確認後は削除すること
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'No API key' })

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`,
  )
  const data = await r.json() as { models?: Array<{ name: string; supportedGenerationMethods?: string[] }> }

  const usable = (data.models ?? [])
    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
    .map(m => m.name)

  return res.status(200).json({ usable })
}
