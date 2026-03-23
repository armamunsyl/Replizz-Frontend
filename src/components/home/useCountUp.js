import { useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

function parseDisplayValue(value) {
  const raw = String(value ?? '').trim()
  const numeric = raw.replace(/[^0-9.]/g, '')
  const target = Number.parseFloat(numeric)

  if (!Number.isFinite(target)) {
    return {
      target: 0,
      format: () => raw,
      isValid: false,
    }
  }

  const prefixMatch = raw.match(/^[^\d]*/)
  const suffixMatch = raw.match(/[^\d.]*$/)
  const prefix = prefixMatch?.[0] ?? ''
  const suffix = suffixMatch?.[0] ?? ''
  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0
  const hasComma = raw.includes(',')

  const formatNumber = (next) => {
    if (decimals > 0) {
      return next.toFixed(decimals)
    }

    const rounded = Math.round(next)

    if (hasComma || rounded >= 1000) {
      return rounded.toLocaleString('en-US')
    }

    return String(rounded)
  }

  return {
    target,
    format: (next) => `${prefix}${formatNumber(next)}${suffix}`,
    isValid: true,
  }
}

export function useCountUp(value, duration = 1600) {
  const targetRef = useRef(null)
  const frameRef = useRef(0)
  const inView = useInView(targetRef, { once: true, amount: 0.5 })
  const parsed = useMemo(() => parseDisplayValue(value), [value])
  const [display, setDisplay] = useState(() => parsed.format(0))

  useEffect(() => {
    if (!inView || !parsed.isValid) {
      return undefined
    }

    let startedAt = 0

    const tick = (time) => {
      if (!startedAt) {
        startedAt = time
      }

      const progress = Math.min((time - startedAt) / duration, 1)
      const nextValue = parsed.target * progress
      setDisplay(parsed.format(nextValue))

      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick)
      }
    }

    frameRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frameRef.current)
    }
  }, [duration, inView, parsed])

  return {
    ref: targetRef,
    display,
  }
}
