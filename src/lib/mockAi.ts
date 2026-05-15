import type { Step, TaskPlan } from '../types'

export const SAMPLE_INPUT =
  '帰ったらランドセル置いて、手を洗って、連絡帳を出して、宿題を10分だけやろう'

function splitInstructions(text: string): string[] {
  // 読点・句点・改行で分割
  let parts = text
    .split(/[、。，,\n\r]+/)
    .map(s => s.trim())
    .filter(s => s.length >= 2)

  // 分割できなかったときは「て/で」の後ろで分割
  if (parts.length <= 1) {
    const chunks: string[] = []
    let buf = ''
    for (let i = 0; i < text.length; i++) {
      buf += text[i]
      const next = text[i + 1] ?? ''
      if ((text[i] === 'て' || text[i] === 'で') && !/[もはをが]/.test(next)) {
        if (buf.trim().length >= 2) chunks.push(buf.trim())
        buf = ''
      }
    }
    if (buf.trim().length >= 2) chunks.push(buf.trim())
    parts = chunks.length > 1 ? chunks : [text.trim()]
  }

  return parts.slice(0, 7)
}

function toDisplayText(raw: string): string {
  return (
    raw
      .replace(
        /^(まず|そして|次に|つぎに|それから|あとは|ちゃんと|はやく|きちんと)\s*/u,
        '',
      )
      .replace(/\s*(ください|くださいね|ね|ぞ|な|よね)$/u, '')
      .trim() || raw.trim()
  )
}

function toSpeakText(text: string, index: number, total: number): string {
  if (total === 1) return `${text}だよ`
  if (index === 0) return `まず、${text}よ`
  if (index === total - 1) return `さいごに、${text}よ`
  if (total - index === 2) return `あと2つ！${text}よ`
  if (total - index === 1) return `あと1つ！${text}よ`
  return `つぎは、${text}よ`
}

export function generateMockPlan(input: string): TaskPlan {
  const parts = splitInstructions(input.trim())

  const steps: Step[] = parts.map((part, i) => {
    const text = toDisplayText(part)
    return { text, speak: toSpeakText(text, i, parts.length) }
  })

  const shortTitle = input.length > 12 ? `${input.slice(0, 10)}…` : input

  return {
    title: shortTitle,
    steps,
    encouragement: 'ここまでできたら、じゅうぶんえらい！',
  }
}
