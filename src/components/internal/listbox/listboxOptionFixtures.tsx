import { Apple, Citrus, Grape } from 'lucide-react'
import type { ListboxOption } from './Listbox.types'

export const fruitOptions: ListboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
]

export const optionsWithDisabledOption: ListboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', isDisabled: true },
  { value: 'date', label: 'Date' },
]

export const manyOptions: ListboxOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i}`,
}))

export const optionsWithDescription: ListboxOption[] = [
  { value: 'apple', label: 'Apple', description: 'Crisp and sweet' },
  { value: 'banana', label: 'Banana', description: 'Soft and creamy' },
  { value: 'cherry', label: 'Cherry', description: 'Small and tart' },
]

export const optionsWithStartContent: ListboxOption[] = [
  { value: 'apple', label: 'Apple', startContent: <Apple size={16} /> },
  { value: 'citrus', label: 'Citrus', startContent: <Citrus size={16} /> },
  { value: 'grape', label: 'Grape', startContent: <Grape size={16} /> },
]

export const optionsWithEndContent: ListboxOption[] = [
  { value: 'apple', label: 'Apple', endContent: <span className="text-xs opacity-60">12 in stock</span> },
  { value: 'banana', label: 'Banana', endContent: <span className="text-xs opacity-60">5 in stock</span> },
  { value: 'cherry', label: 'Cherry', endContent: <span className="text-xs opacity-60">0 in stock</span> },
]

export const optionsWithEverything: ListboxOption[] = [
  {
    value: 'apple',
    label: 'Apple',
    description: 'Crisp and sweet',
    startContent: <Apple size={16} />,
    endContent: <span className="text-xs opacity-60">12 in stock</span>,
  },
  {
    value: 'citrus',
    label: 'Citrus',
    description: 'Tangy and juicy',
    startContent: <Citrus size={16} />,
    endContent: <span className="text-xs opacity-60">5 in stock</span>,
  },
  {
    value: 'grape',
    label: 'Grape',
    description: 'Sweet and juicy',
    startContent: <Grape size={16} />,
    endContent: <span className="text-xs opacity-60">0 in stock</span>,
  },
]
