import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'

export interface Cycle {
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const stateJSON = localStorage.getItem('@ignite-timer:cyclesState-1.0.0')

      if (stateJSON) {
        const jsonResult = JSON.parse(stateJSON)
        jsonResult.cycles = jsonResult.cycles.map((cycle: Cycle) => {
          cycle.startDate = new Date(cycle.startDate)
          cycle.interruptedDate = cycle.interruptedDate
            ? new Date(cycle.interruptedDate)
            : undefined
          cycle.finishedDate = cycle.finishedDate
            ? new Date(cycle.finishedDate)
            : undefined

          return cycle
        })
        return jsonResult
      } else {
        return initialState
      }
    },
  )
  const { cycles, activeCycleId } = cyclesState

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function resetActiveCycle() {
    setAmountSecondsPassed(0)
    document.title = 'Ignite Timer'
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
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

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cyclesState-1.0.0', stateJSON)
  }, [cyclesState])

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
