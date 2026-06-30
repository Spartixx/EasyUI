import type { ReactNode } from 'react'

interface HasOutsideContentParams {
  startContent?: ReactNode
  startContentPlacement?: 'inside' | 'outside'
  endContent?: ReactNode
  endContentPlacement?: 'inside' | 'outside'
}

export function hasOutsideContent({
  startContent,
  startContentPlacement,
  endContent,
  endContentPlacement,
}: HasOutsideContentParams): boolean {
  return (!!startContent && startContentPlacement === 'outside') || (!!endContent && endContentPlacement === 'outside')
}
