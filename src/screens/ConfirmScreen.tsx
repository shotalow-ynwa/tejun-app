import type { TaskPlan } from '../types'

interface Props {
  plan: TaskPlan
  onPlanChange: (plan: TaskPlan) => void
  onStart: () => void
  onBack: () => void
}

export default function ConfirmScreen({ plan, onPlanChange, onStart, onBack }: Props) {
  function updateStepText(index: number, text: string) {
    const steps = plan.steps.map((s, i) => (i === index ? { ...s, text } : s))
    onPlanChange({ ...plan, steps })
  }

  return (
    <div
      className="flex flex-col min-h-dvh px-5 pt-4"
      style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
    >
      {/* ヘッダー */}
      <div className="flex items-center gap-2 pb-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center text-xl rounded-full active:bg-gray-100"
          style={{ color: '#AAA' }}
        >
          ←
        </button>
        <h2 className="text-xl font-extrabold" style={{ color: '#333' }}>
          手順を確認する
        </h2>
      </div>

      <p className="text-sm pb-4" style={{ color: '#999' }}>
        タップして変えることもできるよ
      </p>

      {/* ステップ一覧 */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {plan.steps.map((step, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-4 rounded-2xl animate-fade-in-up"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <span
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-extrabold text-white"
              style={{ backgroundColor: '#4CAF82' }}
            >
              {i + 1}
            </span>
            <input
              type="text"
              value={step.text}
              onChange={e => updateStepText(i, e.target.value)}
              className="flex-1 text-base font-bold outline-none bg-transparent min-w-0"
              style={{ color: '#1A1A1A' }}
            />
          </div>
        ))}
      </div>

      {/* 開始ボタン */}
      <div className="pt-5">
        <button
          onClick={onStart}
          className="w-full py-5 rounded-2xl text-xl font-extrabold text-white transition-transform active:scale-95"
          style={{
            backgroundColor: '#4CAF82',
            boxShadow: '0 4px 20px rgba(76,175,130,0.4)',
          }}
        >
          これで始める 🎯
        </button>
      </div>
    </div>
  )
}
