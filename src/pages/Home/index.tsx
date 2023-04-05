import { HandPalm, Play } from 'phosphor-react'
import { UseFormRegister, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { createContext, useState } from 'react'
import { Countdown } from './components/Countdown'
import { NewCycleFormStructure } from './components/NewCycleFormStructure'

const newCycleValidationSchema = zod.object({
  task: zod
    .string()
    .nonempty()
    .min(1, 'Informe a tarefa')
    .max(64, 'Máximo de 64 caracteres'),
  minutesAmount: zod
    .number()
    .min(5, 'Mínimo de 5 minutos')
    .max(60, 'Máximo de 60 minutos'),
})

type NewCycleFormData = zod.infer<typeof newCycleValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface ICyclesContext {
  activeCycle: Cycle | undefined
  cycles: Cycle[]
  activeCycleId: string | null
  amountSecondsPassed: number
  setAmountSecondsPassed: (amountSecondsPassed: number) => void
  resetActiveCycle: () => void
  markCurrentCycleAsFinished: () => void
  register: UseFormRegister<NewCycleFormData>
}

export const CyclesContext = createContext({} as ICyclesContext)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const task = watch('task')
  const isSubmitButtonDisabled = !task

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function resetActiveCycle() {
    setActiveCycleId(null)
    setAmountSecondsPassed(0)
    document.title = 'Ignite Timer'
  }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    resetActiveCycle()
  }

  function handleCreateNewCycle(data: NewCycleFormData) {
    const exactMomentDate = new Date()
    const id = String(exactMomentDate.getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: exactMomentDate,
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        cycles,
        activeCycleId,
        amountSecondsPassed,
        setAmountSecondsPassed,
        resetActiveCycle,
        markCurrentCycleAsFinished,
        register,
      }}
    >
      <HomeContainer>
        <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
          <NewCycleFormStructure />
          <Countdown />
          {activeCycle ? (
            <StopCountdownButton type="button" onClick={handleInterruptCycle}>
              <HandPalm />
              Interromper
            </StopCountdownButton>
          ) : (
            <StartCountdownButton
              type="submit"
              disabled={isSubmitButtonDisabled}
            >
              <Play />
              Começar
            </StartCountdownButton>
          )}
        </form>
      </HomeContainer>
    </CyclesContext.Provider>
  )
}
