export type Step = {
  text: string
  speak: string
}

export type TaskPlan = {
  title: string
  steps: Step[]
  encouragement: string
}

export type Screen = 'input' | 'confirm' | 'step' | 'complete'
