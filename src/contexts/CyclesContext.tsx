import { ReactNode, createContext, useState } from 'react'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CreateNewCycleData {
  task: string
  minutesAmount: number
}

interface ICyclesContext {
  activeCycle: Cycle | undefined
  cycles: Cycle[]
  activeCycleId: string | null
  amountSecondsPassed: number
  setAmountSecondsPassed: (amountSecondsPassed: number) => void
  resetActiveCycle: () => void
  markCurrentCycleAsFinished: () => void
  createNewCycle: (data: CreateNewCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as ICyclesContext)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function resetActiveCycle() {
    setActiveCycleId(null)
    setAmountSecondsPassed(0)
    document.title = 'Ignite Timer'
  }

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

  function interruptCurrentCycle() {
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

  function createNewCycle(data: CreateNewCycleData) {
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
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
