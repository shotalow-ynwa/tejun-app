// SpeechRecognition の型は標準 DOM lib に含まれないため、必要な部分だけインライン定義
interface SrResult {
  readonly isFinal: boolean
  readonly 0: { transcript: string }
}
interface SrResultList {
  readonly length: number
  readonly [n: number]: SrResult
}
interface SrEvent {
  readonly results: SrResultList
}
interface SrInstance {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  continuous: boolean
  onresult: ((ev: SrEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}
type SrCtor = new () => SrInstance

function getApi(): SrCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as Window & {
    SpeechRecognition?: SrCtor
    webkitSpeechRecognition?: SrCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function isVoiceSupported(): boolean {
  return getApi() !== null
}

export function startListening(
  onTranscript: (text: string, isFinal: boolean) => void,
  onEnd: () => void,
): () => void {
  const Api = getApi()
  if (!Api) {
    onEnd()
    return () => {}
  }

  const rec = new Api()
  rec.lang = 'ja-JP'
  rec.interimResults = true
  rec.maxAlternatives = 1
  rec.continuous = false

  rec.onresult = (e) => {
    let interim = ''
    let final = ''
    for (let i = 0; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) final += r[0].transcript
      else interim += r[0].transcript
    }
    const text = final || interim
    if (text) onTranscript(text, !!final)
  }

  rec.onerror = () => onEnd()
  rec.onend = () => onEnd()
  rec.start()

  return () => {
    try { rec.stop() } catch { /* ignore */ }
  }
}
