import { useContext } from 'react'
import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { CyclesContext } from '../..'

export function NewCycleFormStructure() {
  const { register, activeCycle } = useContext(CyclesContext)
  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        {...register('task')}
      />

      <datalist id="task-suggestions">
        <option value={'Projeto 1'} />
        <option value={'Projeto 2'} />
        <option value={'Projeto 3'} />
        <option value={'Projeto 4'} />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        id="minutesAmount"
        type="number"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />
      <span>minutos.</span>
    </FormContainer>
  )
}
