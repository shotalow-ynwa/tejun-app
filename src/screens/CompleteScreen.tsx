import { useEffect, useState } from 'react'
import type { TaskPlan } from '../types'
import Character from '../components/Character'

interface Props {
  plan: TaskPlan
  onRestart: () => void
  onNewTask: () => void
}

export default function CompleteScreen({ plan, onRestart, onNewTask }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="flex flex-col min-h-dvh items-center justify-center text-center px-6"
      style={{
        paddingBottom: 'max(28px, env(safe-area-inset-bottom))',
        background: 'linear-gradient(160deg, #F1FBF5 0%, #FFFBF5 60%)',
      }}
    >
      {/* スタンプ */}
      <div
        className="text-5xl mb-4 animate-fade-in-up"
        style={{ letterSpacing: '6px' }}
      >
        ⭐🌟⭐🌟⭐
      </div>

      {/* キャラクター */}
      <div
        className="transition-all duration-500"
        style={{ transform: show ? 'scale(1)' : 'scale(0.6)', opacity: show ? 1 : 0 }}
      >
        <Character mood="done" />
      </div>

      {/* メッセージ */}
      <div className="mt-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <p
          className="font-extrabold"
          style={{ fontSize: 'clamp(2rem, 12vw, 3rem)', color: '#4CAF82' }}
        >
          ぜんぶできた！
        </p>
        <p
          className="text-lg mt-3 font-bold"
          style={{ color: '#888', lineHeight: 1.6 }}
        >
          {plan.encouragement}
        </p>
      </div>

      {/* 完了件数 */}
      <div
        className="mt-5 px-6 py-3 rounded-2xl animate-fade-in-up"
        style={{
          backgroundColor: '#E8F5E9',
          color: '#4CAF82',
          animationDelay: '0.25s',
        }}
      >
        <span className="text-lg font-extrabold">
          {plan.steps.length} つ、クリア！
        </span>
      </div>

      {/* ボタン */}
      <div
        className="w-full max-w-sm mt-10 flex flex-col gap-3 animate-fade-in-up"
        style={{ animationDelay: '0.35s' }}
      >
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl text-lg font-extrabold text-white transition-transform active:scale-95"
          style={{
            backgroundColor: '#4CAF82',
            boxShadow: '0 4px 20px rgba(76,175,130,0.4)',
          }}
        >
          もう一回やる 🔄
        </button>
        <button
          onClick={onNewTask}
          className="w-full py-4 rounded-2xl text-base font-bold transition-transform active:scale-95"
          style={{ backgroundColor: '#F0F0F0', color: '#666' }}
        >
          新しく作る
        </button>
      </div>
    </div>
  )
}
