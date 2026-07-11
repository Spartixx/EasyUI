import type { NumberStepDirection } from '../../internal/field'

export function sanitizeNumericText(raw: string): string {
  const isNegative = raw.startsWith('-')
  const digitsAndDot = raw.replace(/[^\d.]/g, '')
  const firstDotIndex = digitsAndDot.indexOf('.')
  const singleDot =
    firstDotIndex === -1
      ? digitsAndDot
      : digitsAndDot.slice(0, firstDotIndex + 1) + digitsAndDot.slice(firstDotIndex + 1).replace(/\./g, '')
  return isNegative ? `-${singleDot}` : singleDot
}

export function parseNumericText(text: string): number | null {
  if (text === '' || text === '-' || text === '.' || text === '-.') return null
  const parsed = Number(text)
  return Number.isNaN(parsed) ? null : parsed
}

export function formatNumericValue(value: number | null): string {
  return value === null ? '' : String(value)
}

export function clampToRange(value: number, min?: number, max?: number): number {
  let result = value
  if (min !== undefined && result < min) result = min
  if (max !== undefined && result > max) result = max
  return result
}

function decimalPlaces(value: number): number {
  const text = String(value)
  const dotIndex = text.indexOf('.')
  return dotIndex === -1 ? 0 : text.length - dotIndex - 1
}

export function stepNumericValue(
  current: number | null,
  direction: NumberStepDirection,
  step: number,
  min?: number,
  max?: number,
): number {
  const base = current ?? min ?? 0
  const delta = direction === 'increment' ? step : -step
  const clamped = clampToRange(base + delta, min, max)
  const decimals = Math.max(decimalPlaces(step), decimalPlaces(base))
  return Number(clamped.toFixed(decimals))
}
