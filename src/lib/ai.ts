import type { TaskPlan } from '../types'
import { generateMockPlan } from './mockAi'

export type PlanSource = 'api' | 'mock'

export async function generatePlan(
  input: string,
): Promise<{ plan: TaskPlan; source: PlanSource }> {
  try {
    const res = await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(err.error ?? `HTTP ${res.status}`)
    }

    const plan = (await res.json()) as TaskPlan

    if (!Array.isArray(plan.steps) || plan.steps.length === 0) {
      throw new Error('Invalid plan received from API')
    }

    return { plan, source: 'api' }
  } catch (err) {
    console.warn('[ai] API failed, using mock fallback:', err)
    return { plan: generateMockPlan(input), source: 'mock' }
  }
}
