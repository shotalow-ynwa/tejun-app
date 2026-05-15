import { useState } from 'react'
import type { TaskPlan } from '../types'

interface Props {
  plan: TaskPlan
  onPlanChange: (plan: TaskPlan) => void
  onStart: () => void
  onBack: () => void
}

export default function ConfirmScreen({ plan, onPlanChange, onStart, onBack }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function updateStepText(index: number, text: string) {
    const steps = plan.steps.map((s, i) => (i === index ? { ...s, text } : s))
    onPlanChange({ ...plan, steps })
  }

  function removeStep(index: number) {
    const steps = plan.steps.filter((_, i) => i !== index)
    onPlanChange({ ...plan, steps })
  }

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
    >
      {/* 親ゾーン：ヘッダー */}
      <div
        className="px-5 pt-4 pb-4"
        style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #D1FAE5' }}
      >
        <div className="flex items-center gap-2 pb-1">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full active:bg-green-100 text-xl"
            style={{ color: '#AAA' }}
          >
            ←
          </button>
          <div>
            <p className="text-xs font-bold" style={{ color: '#4CAF82' }}>
              👨‍👩‍👧 おとなが確認するところ
            </p>
            <h2 className="text-lg font-extrabold leading-tight" style={{ color: '#1A1A1A' }}>
              手順を確認してください
            </h2>
          </div>
        </div>
        <p className="text-xs pl-11" style={{ color: '#888' }}>
          タップして直すことができます。OKなら下のボタンを押してください。
        </p>
      </div>

      {/* ステップ一覧 */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {plan.steps.map((step, i) => (
          <div
            key={i}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div
              className="flex items-start gap-3 p-4 rounded-2xl"
              style={{
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                border: editingIndex === i ? '2px solid #4CAF82' : '2px solid transparent',
              }}
            >
              {/* 番号 */}
              <span
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
                style={{ backgroundColor: '#4CAF82' }}
              >
                {i + 1}
              </span>

              {/* テキスト（タップで編集） */}
              {editingIndex === i ? (
                <input
                  type="text"
                  value={step.text}
                  onChange={e => updateStepText(i, e.target.value)}
                  onBlur={() => setEditingIndex(null)}
                  autoFocus
                  className="flex-1 text-base font-bold outline-none bg-transparent min-w-0"
                  style={{ color: '#1A1A1A' }}
                />
              ) : (
                <button
                  className="flex-1 text-left text-base font-bold min-w-0"
                  style={{ color: '#1A1A1A', background: 'none', border: 'none' }}
                  onClick={() => setEditingIndex(i)}
                >
                  {step.text}
                  <span className="text-xs ml-2" style={{ color: '#CCC' }}>✏️</span>
                </button>
              )}

              {/* 削除 */}
              {plan.steps.length > 1 && (
                <button
                  onClick={() => removeStep(i)}
                  className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full active:bg-red-50 text-lg"
                  style={{ color: '#DDD' }}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}

        {/* ステップ数のメモ */}
        <p className="text-xs text-center py-1" style={{ color: '#CCC' }}>
          {plan.steps.length} つの手順
        </p>
      </div>

      {/* 親OKボタン：ハンドオフの瞬間 */}
      <div
        className="px-5 pt-3 pb-1"
        style={{ borderTop: '1px solid #E8F5E9' }}
      >
        <button
          onClick={onStart}
          disabled={plan.steps.length === 0}
          className="w-full rounded-2xl text-xl font-extrabold text-white transition-transform active:scale-95"
          style={{
            paddingTop: '20px',
            paddingBottom: '20px',
            backgroundColor: plan.steps.length > 0 ? '#4CAF82' : '#C8E6C9',
            boxShadow: plan.steps.length > 0
              ? '0 4px 20px rgba(76,175,130,0.4)'
              : 'none',
          }}
        >
          OK！ 子どもに渡す →
        </button>
        <p className="text-xs text-center mt-2" style={{ color: '#CCC' }}>
          ここを押したら子ども画面に切り替わります
        </p>
      </div>
    </div>
  )
}
