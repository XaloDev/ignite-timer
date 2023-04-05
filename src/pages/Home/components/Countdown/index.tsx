import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { CyclesContext } from '../..'
import { differenceInSeconds } from 'date-fns'

export function Countdown() {
  const {
    activeCycle,
    amountSecondsPassed,
    activeCycleId,
    setAmountSecondsPassed,
    resetActiveCycle,
    markCurrentCycleAsFinished,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const screenMinutesAmount = String(minutesAmount).padStart(2, '0')
  const screenSecondsAmount = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          resetActiveCycle()
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    resetActiveCycle,
    setAmountSecondsPassed,
  ])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${screenMinutesAmount}:${screenSecondsAmount} - ${activeCycle.task}`
    }
  }, [screenMinutesAmount, screenSecondsAmount, activeCycle])

  return (
    <CountdownContainer>
      <span>{screenMinutesAmount[0]}</span>
      <span>{screenMinutesAmount[1]}</span>
      <Separator>:</Separator>
      <span>{screenSecondsAmount[0]}</span>
      <span>{screenSecondsAmount[1]}</span>
    </CountdownContainer>
  )
}
