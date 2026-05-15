export type Mood = 'idle' | 'cheering' | 'done'

interface Props {
  mood: Mood
  animating?: boolean
}

/*
  シンプルな丸キャラ（ねこ風）。
  mood が変わると表情が変わる。animating=true で celebrate アニメーション。
  done では浮かぶアニメーションが自動でかかる。
*/
export default function Character({ mood, animating = false }: Props) {
  const isHappy = mood === 'cheering' || mood === 'done'
  const bodyColor = mood === 'done' ? '#B5E3A0' : '#FFD93D'
  const earColor = mood === 'done' ? '#7CC96F' : '#FFB347'

  let animClass = ''
  if (animating) animClass = 'animate-celebrate'
  else if (mood === 'done') animClass = 'animate-float'

  return (
    <div className={animClass} style={{ display: 'inline-block', lineHeight: 0 }}>
      <svg viewBox="0 0 100 100" width="110" height="110" aria-hidden="true">
        {/* 耳（左） */}
        <ellipse cx="24" cy="24" rx="12" ry="14" fill={bodyColor} transform="rotate(-15 24 24)" />
        <ellipse cx="24" cy="24" rx="7" ry="9" fill={earColor} transform="rotate(-15 24 24)" />
        {/* 耳（右） */}
        <ellipse cx="76" cy="24" rx="12" ry="14" fill={bodyColor} transform="rotate(15 76 24)" />
        <ellipse cx="76" cy="24" rx="7" ry="9" fill={earColor} transform="rotate(15 76 24)" />
        {/* 体 */}
        <circle cx="50" cy="58" r="38" fill={bodyColor} />

        {/* 通常の顔 */}
        {!isHappy && (
          <>
            <circle cx="36" cy="52" r="5.5" fill="#3D2C2C" />
            <circle cx="64" cy="52" r="5.5" fill="#3D2C2C" />
            <circle cx="38" cy="50" r="2" fill="white" />
            <circle cx="66" cy="50" r="2" fill="white" />
            <ellipse cx="50" cy="61" rx="3" ry="2" fill={earColor} />
            <path d="M 38 68 Q 50 76 62 68" stroke="#3D2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="28" cy="63" rx="8" ry="5" fill="#FFB3B3" opacity="0.4" />
            <ellipse cx="72" cy="63" rx="8" ry="5" fill="#FFB3B3" opacity="0.4" />
          </>
        )}

        {/* うれしい顔 */}
        {isHappy && (
          <>
            <path d="M 30 52 Q 36 44 42 52" stroke="#3D2C2C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 58 52 Q 64 44 70 52" stroke="#3D2C2C" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <ellipse cx="50" cy="61" rx="3" ry="2" fill={earColor} />
            <path d="M 34 66 Q 50 79 66 66" stroke="#3D2C2C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="26" cy="65" rx="9" ry="6" fill="#FF8FA3" opacity="0.5" />
            <ellipse cx="74" cy="65" rx="9" ry="6" fill="#FF8FA3" opacity="0.5" />
          </>
        )}
      </svg>
    </div>
  )
}
