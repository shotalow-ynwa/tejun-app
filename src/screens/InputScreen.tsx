import { useState, useRef, useEffect } from 'react'
import { SAMPLE_INPUT } from '../lib/mockAi'
import { generatePlan } from '../lib/ai'
import { startListening, isVoiceSupported } from '../lib/voiceInput'
import type { TaskPlan } from '../types'

interface Props {
  onPlanReady: (plan: TaskPlan) => void
}

export default function InputScreen({ onPlanReady }: Props) {
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [usedMock, setUsedMock] = useState(false)
  const stopRef = useRef<(() => void) | null>(null)
  const voiceSupported = isVoiceSupported()

  // コンポーネントアンマウント時に音声認識を止める
  useEffect(() => {
    return () => { stopRef.current?.() }
  }, [])

  function handleMic() {
    if (listening) {
      stopRef.current?.()
      return
    }
    setListening(true)
    setInput('')
    stopRef.current = startListening(
      (text, isFinal) => {
        setInput(text)
        // 確定テキストが出たら自動的に止める（safariは1発で止まることが多い）
        if (isFinal) stopRef.current?.()
      },
      () => setListening(false),
    )
  }

  async function handleSubmit() {
    if (!input.trim() || loading) return
    setLoading(true)
    setUsedMock(false)
    const { plan, source } = await generatePlan(input.trim())
    setUsedMock(source === 'mock')
    setLoading(false)
    onPlanReady(plan)
  }

  const canSubmit = input.trim().length >= 2 && !loading && !listening

  return (
    <div
      className="flex flex-col min-h-dvh px-5 pt-4"
      style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
    >
      {/* ヘッダー */}
      <div className="pb-5">
        <h1 className="text-2xl font-extrabold" style={{ color: '#4CAF82' }}>
          てじゅんアプリ
        </h1>
        <p className="text-sm mt-1" style={{ color: '#999' }}>
          やることを話すか、書いてみよう
        </p>
      </div>

      {/* 音声入力ボタン */}
      {voiceSupported && (
        <div className="pb-4">
          <button
            onClick={handleMic}
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-lg font-extrabold text-white transition-all active:scale-95 ${
              listening ? 'animate-mic-pulse' : ''
            }`}
            style={{
              backgroundColor: listening ? '#EF4444' : '#FF9800',
              boxShadow: listening
                ? 'none'
                : '0 4px 20px rgba(255,152,0,0.35)',
            }}
          >
            {listening ? '🔴 きいてるよ… (タップでやめる)' : '🎤 はなして入力'}
          </button>
        </div>
      )}

      {/* テキスト入力 */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold" style={{ color: '#666' }}>
            {voiceSupported ? 'または文字で入力' : '今日やることは？'}
          </label>
          {input.trim().length >= 2 && !listening && (
            <span className="text-xs" style={{ color: '#AAA' }}>
              {input.length}文字
            </span>
          )}
        </div>

        <textarea
          value={input}
          onChange={e => { if (!listening) setInput(e.target.value) }}
          placeholder={listening
            ? '話してください…'
            : '例：帰ったらランドセル置いて、手を洗って、宿題をやろう'}
          readOnly={listening}
          className="rounded-2xl border-2 p-4 text-base resize-none outline-none transition-colors"
          style={{
            borderColor: listening ? '#EF4444' : input.trim() ? '#4CAF82' : '#E0E0E0',
            backgroundColor: listening ? '#FFF5F5' : 'white',
            minHeight: '120px',
            color: listening ? '#666' : '#1A1A1A',
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
          {loading ? '考えてるよ…' : listening ? 'きいてます…' : '手順にする →'}
        </button>

        {usedMock && (
          <p className="text-xs text-center mt-2" style={{ color: '#BBB' }}>
            ※ AI接続できなかったため、サンプル手順を表示しています
          </p>
        )}
      </div>
    </div>
  )
}
