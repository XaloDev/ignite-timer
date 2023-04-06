import { ReactNode, createContext, useReducer, useState } from 'react'

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

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
  amountSecondsPassed: number
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'MARK_CURRENT_CYCLE_AS_FINISHED':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === action.payload.activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        case 'INTERRUPT_CURRENT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === action.payload.id) {
                return {
                  ...cycle,
                  interruptedDate: action.payload.interruptedDate,
                }
              } else {
                return cycle
              }
            }),
            activeCycleId: null,
          }
        default:
          return state
      }
    },
    { cycles: [], activeCycleId: null, amountSecondsPassed: 0 },
  )

  const { cycles, activeCycleId } = cyclesState

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function resetActiveCycle() {
    setAmountSecondsPassed(0)
    document.title = 'Ignite Timer'
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        id: activeCycleId,
        interruptedDate: new Date(),
      },
    })
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

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })

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
