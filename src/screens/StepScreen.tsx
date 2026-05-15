import { useState } from 'react'
import type { TaskPlan } from '../types'
import Character from '../components/Character'
import { speak } from '../lib/speech'

interface Props {
  plan: TaskPlan
  currentStep: number
  onDone: () => void
  onBack: () => void
}

export default function StepScreen({ plan, currentStep, onDone, onBack }: Props) {
  const [animating, setAnimating] = useState(false)

  const step = plan.steps[currentStep]
  const total = plan.steps.length
  const isLast = currentStep === total - 1
  const remaining = total - currentStep - 1

  function handleDone() {
    if (animating) return
    setAnimating(true)
    speak(isLast ? 'やったー！すごい！' : step.speak)
    setTimeout(() => {
      setAnimating(false)
      onDone()
    }, 700)
  }

  function handleSpeak() {
    speak(step.speak)
  }

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      {/* トップバー：もどる + 番号 */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={onBack}
          className="text-base py-2 pr-2 active:opacity-50"
          style={{ color: '#BBB' }}
        >
          ← もどる
        </button>
        <span className="text-sm font-bold" style={{ color: '#BBB' }}>
          {currentStep + 1} / {total}
        </span>
      </div>

      {/* プログレスドット */}
      <div className="flex justify-center gap-2 px-6 pb-3">
        {plan.steps.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              height: '10px',
              width: i === currentStep ? '28px' : '10px',
              backgroundColor:
                i < currentStep ? '#A5D6A7' : i === currentStep ? '#4CAF82' : '#E0E0E0',
            }}
          />
        ))}
      </div>

      {/* 残りバッジ */}
      <div className="flex justify-center pb-2 h-8">
        {isLast ? (
          <span
            className="text-sm font-extrabold px-4 py-1 rounded-full"
            style={{ backgroundColor: '#FFF3E0', color: '#FFB84D' }}
          >
            さいごの1つ！
          </span>
        ) : remaining > 0 ? (
          <span
            className="text-sm font-bold px-4 py-1 rounded-full"
            style={{ backgroundColor: '#E8F5E9', color: '#4CAF82' }}
          >
            あと {remaining} つ
          </span>
        ) : null}
      </div>

      {/* キャラクター */}
      <div className="flex justify-center pt-2 pb-4">
        <Character mood={animating ? 'cheering' : 'idle'} animating={animating} />
      </div>

      {/* ステップテキスト（最重要） */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p
          key={currentStep}
          className="text-center font-extrabold leading-tight animate-fade-in-up"
          style={{ fontSize: 'clamp(2rem, 11vw, 3.2rem)', color: '#1A1A1A' }}
        >
          {step.text}
        </p>
      </div>

      <p className="text-center text-sm font-bold pb-3" style={{ color: '#CCC' }}>
        いまやること
      </p>

      {/* ボタンエリア */}
      <div className="px-5 flex flex-col gap-3">
        {/* できた！メインボタン */}
        <button
          onClick={handleDone}
          disabled={animating}
          className="w-full rounded-3xl text-2xl font-extrabold text-white transition-transform active:scale-95"
          style={{
            paddingTop: '22px',
            paddingBottom: '22px',
            backgroundColor: animating ? '#A5D6A7' : '#4CAF82',
            boxShadow: animating ? 'none' : '0 6px 24px rgba(76,175,130,0.45)',
          }}
        >
          {animating ? 'やったー！ 🎉' : isLast ? 'できた！ ✨' : 'できた！ 👍'}
        </button>

        {/* もう一回きく */}
        <button
          onClick={handleSpeak}
          className="w-full py-3 rounded-2xl text-base font-bold transition-transform active:scale-95"
          style={{ backgroundColor: '#F5F5F5', color: '#777' }}
        >
          🔊 もう一回きく
        </button>
      </div>
    </div>
  )
}
