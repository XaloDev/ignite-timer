import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'
import { Countdown } from './components/Countdown'
import { NewCycleFormStructure } from './components/NewCycleFormStructure'
import { CyclesContext } from '../../contexts/CyclesContext'

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

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CyclesContext)
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { watch, handleSubmit, reset } = newCycleForm

  const task = watch('task')
  const isSubmitButtonDisabled = !task

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  function handleInterruptCycle() {
    interruptCurrentCycle()
  }

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleFormStructure />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitButtonDisabled}>
            <Play />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
