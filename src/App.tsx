import { useState } from 'react'
import type { Screen, TaskPlan } from './types'
import InputScreen from './screens/InputScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import StepScreen from './screens/StepScreen'
import CompleteScreen from './screens/CompleteScreen'

export default function App() {
  const [screen, setScreen] = useState<Screen>('input')
  const [plan, setPlan] = useState<TaskPlan | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  function handlePlanReady(p: TaskPlan) {
    setPlan(p)
    setScreen('confirm')
  }

  function handleStart() {
    setCurrentStep(0)
    setScreen('step')
  }

  function handleDone() {
    if (!plan) return
    if (currentStep < plan.steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setScreen('complete')
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    } else {
      setScreen('confirm')
    }
  }

  function handleRestart() {
    setCurrentStep(0)
    setScreen('step')
  }

  function handleNewTask() {
    setPlan(null)
    setCurrentStep(0)
    setScreen('input')
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: '#FFFBF5' }}>
      {screen === 'input' && <InputScreen onPlanReady={handlePlanReady} />}
      {screen === 'confirm' && plan && (
        <ConfirmScreen
          plan={plan}
          onPlanChange={setPlan}
          onStart={handleStart}
          onBack={() => setScreen('input')}
        />
      )}
      {screen === 'step' && plan && (
        <StepScreen
          plan={plan}
          currentStep={currentStep}
          onDone={handleDone}
          onBack={handleBack}
        />
      )}
      {screen === 'complete' && plan && (
        <CompleteScreen
          plan={plan}
          onRestart={handleRestart}
          onNewTask={handleNewTask}
        />
      )}
    </div>
  )
}
