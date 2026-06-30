import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { ListboxOption } from './Listbox.types'

interface UseListboxNavigationParams {
  options: ListboxOption[]
  currentValue: string | undefined
  triggerRef: RefObject<HTMLElement | null>
  listboxRef: RefObject<HTMLUListElement | null>
  optionId: (index: number) => string
  onOutsideClose?: () => void
}

export function useListboxNavigation({
  options,
  currentValue,
  triggerRef,
  listboxRef,
  optionId,
  onOutsideClose,
}: UseListboxNavigationParams) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const enabledIndexes = options.reduce<number[]>((acc, option, index) => {
    if (!option.isDisabled) acc.push(index)
    return acc
  }, [])

  const openListbox = () => {
    const selectedIndex = options.findIndex((option) => option.value === currentValue)
    setActiveIndex(selectedIndex !== -1 ? selectedIndex : (enabledIndexes[0] ?? -1))
    setIsOpen(true)
  }

  const closeListbox = () => {
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const moveActiveIndex = (direction: 1 | -1) => {
    if (enabledIndexes.length === 0) return
    const currentPos = enabledIndexes.indexOf(activeIndex)
    const nextPos = Math.min(Math.max(currentPos + direction, 0), enabledIndexes.length - 1)
    setActiveIndex(enabledIndexes[nextPos])
  }

  const handleArrowKey = (e: { preventDefault: () => void }, direction: 1 | -1) => {
    e.preventDefault()
    if (isOpen) moveActiveIndex(direction)
    else openListbox()
  }

  useEffect(() => {
    if (!isOpen || activeIndex === -1) return
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: 'nearest' })
  }, [isOpen, activeIndex])

  const onOutsideCloseRef = useRef(onOutsideClose)
  useEffect(() => {
    onOutsideCloseRef.current = onOutsideClose
  })

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (listboxRef.current?.contains(target)) return
      onOutsideCloseRef.current?.()
      closeListbox()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, triggerRef, listboxRef])

  return {
    isOpen,
    activeIndex,
    setActiveIndex,
    enabledIndexes,
    openListbox,
    closeListbox,
    handleArrowKey,
  }
}
