import type { VercelRequest, VercelResponse } from '@vercel/node'

// 型はsrc/types.tsと同一にする（クロスディレクトリ参照を避けてインライン定義）
type Step = { text: string; speak: string }
type TaskPlan = { title: string; steps: Step[]; encouragement: string }

const MODEL = 'gemini-2.0-flash-lite'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const SYSTEM_PROMPT = `あなたは学習障害・ADHD傾向の小学生を支援する専門家です。
親や先生の口頭指示を、子どもが1つずつ実行できる手順に分解してください。

ルール：
- 1手順1動作
- 小学生向けの短い言葉（表示テキストは15文字以内が理想）
- 実行順に並べる
- 最大7ステップ
- 「ちゃんと」「早く」などの曖昧語は具体的な動作に変える
- 命令しすぎない、柔らかい言い回し
- 子どもが怒られたと感じない表現にする

以下のJSONのみ返してください（説明・コードブロック不要）：
{
  "title": "全体タイトル（10文字以内）",
  "steps": [
    { "text": "表示テキスト（短く）", "speak": "やさしい読み上げテキスト（〜しよう / 〜だよ 調）" }
  ],
  "encouragement": "終わった後のほめ言葉（1文・やさしく）"
}`

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
    finishReason?: string
  }>
  error?: { message: string; status: string }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set')
    return res.status(500).json({ error: 'API key not configured' })
  }

  const body = req.body as Record<string, unknown>
  const input = typeof body?.input === 'string' ? body.input.trim() : ''
  if (input.length < 2) {
    return res.status(400).json({ error: 'Input too short' })
  }

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
          { role: 'user', parts: [{ text: `指示内容：${input}` }] },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 600,
          temperature: 0.2,
        },
      }),
    })

    const data = (await geminiRes.json()) as GeminiResponse

    if (!geminiRes.ok) {
      console.error('Gemini API error:', geminiRes.status, data.error)
      return res.status(502).json({ error: `Gemini error ${geminiRes.status}: ${data.error?.message ?? 'unknown'}` })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.error('Gemini returned empty content:', JSON.stringify(data))
      return res.status(502).json({ error: 'Empty response from Gemini' })
    }

    const plan = JSON.parse(text) as TaskPlan
    if (!Array.isArray(plan.steps) || plan.steps.length === 0) {
      throw new Error('Invalid plan: steps missing')
    }

    return res.status(200).json(plan)
  } catch (err) {
    console.error('Error in /api/steps:', err)
    return res.status(502).json({ error: String(err) })
  }
}
