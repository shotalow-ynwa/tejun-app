import { useState } from 'react'
import { generateMockPlan, SAMPLE_INPUT } from '../lib/mockAi'
import type { TaskPlan } from '../types'

interface Props {
  onPlanReady: (plan: TaskPlan) => void
}

export default function InputScreen({ onPlanReady }: Props) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!input.trim() || loading) return
    setLoading(true)
    // 少し間を置くことで「考えてる感」を出す（後でAPI呼び出しに差し替え）
    await new Promise(r => setTimeout(r, 700))
    const plan = generateMockPlan(input.trim())
    setLoading(false)
    onPlanReady(plan)
  }

  const canSubmit = input.trim().length >= 2 && !loading

  return (
    <div
      className="flex flex-col min-h-dvh px-5 pt-4"
      style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
    >
      {/* ヘッダー */}
      <div className="pb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: '#4CAF82' }}>
          てじゅんアプリ
        </h1>
        <p className="text-sm mt-1" style={{ color: '#999' }}>
          やることをかいてみよう
        </p>
      </div>

      {/* 入力エリア */}
      <div className="flex-1 flex flex-col gap-3">
        <label className="text-base font-bold" style={{ color: '#444' }}>
          今日やることは？
        </label>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'例：帰ったらランドセル置いて、\n手を洗って、宿題をやろう'}
          className="rounded-2xl border-2 p-4 text-base resize-none outline-none transition-colors"
          style={{
            borderColor: input.trim() ? '#4CAF82' : '#E0E0E0',
            backgroundColor: 'white',
            minHeight: '160px',
            color: '#1A1A1A',
            lineHeight: '1.75',
            flex: '1 1 auto',
          }}
        />

        <button
          onClick={() => setInput(SAMPLE_INPUT)}
          className="self-start text-sm py-2 px-4 rounded-xl transition-opacity active:opacity-60"
          style={{ color: '#888', backgroundColor: '#F0F0F0' }}
        >
          サンプルを使う
        </button>
      </div>

      {/* 送信ボタン */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-5 rounded-2xl text-xl font-extrabold text-white transition-all active:scale-95"
          style={{
            backgroundColor: canSubmit ? '#4CAF82' : '#C8E6C9',
            boxShadow: canSubmit ? '0 4px 20px rgba(76,175,130,0.4)' : 'none',
          }}
        >
          {loading ? '考えてるよ…' : '手順にする →'}
        </button>
      </div>
    </div>
  )
}
