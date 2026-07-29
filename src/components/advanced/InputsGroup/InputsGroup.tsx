import { forwardRef } from 'react'
import type { Ref } from 'react'
import { cn } from '../../../utils/cn'
import { Input, InputNumber } from '../../primitives'
import { InputsGroupCore } from './InputsGroupCore'
import type { InputsGroupNumberProps, InputsGroupProps, InputsGroupTextProps } from './InputsGroup.types'

function TextInputsGroup({
  inputProps,
  containerRef,
  ...rest
}: InputsGroupTextProps & { containerRef?: Ref<HTMLDivElement> }) {
  return (
    <InputsGroupCore<string, string>
      {...rest}
      containerRef={containerRef}
      emptyValue=""
      isNonEmpty={(value): value is string => value !== ''}
      renderInput={(params) => (
        <Input
          size={params.size}
          {...inputProps}
          id={params.id}
          isFullWidth
          value={params.value}
          onValueChange={params.onValueChange}
          isRequired={params.isRequired}
          isRequiredMessage={params.isRequiredMessage}
          validations={params.validations}
          isDisabled={params.isDisabled}
          error={params.error}
          className={cn(inputProps?.className, params.className)}
        />
      )}
    />
  )
}

function NumberInputsGroup({
  inputProps,
  containerRef,
  ...rest
}: InputsGroupNumberProps & { containerRef?: Ref<HTMLDivElement> }) {
  return (
    <InputsGroupCore<number | null, number>
      {...rest}
      containerRef={containerRef}
      emptyValue={null}
      isNonEmpty={(value): value is number => value !== null}
      renderInput={(params) => (
        <InputNumber
          size={params.size}
          {...inputProps}
          id={params.id}
          isFullWidth
          value={params.value}
          onValueChange={params.onValueChange}
          isRequired={params.isRequired}
          isRequiredMessage={params.isRequiredMessage}
          validations={params.validations}
          isDisabled={params.isDisabled}
          error={params.error}
          className={cn(inputProps?.className, params.className)}
        />
      )}
    />
  )
}

export const InputsGroup = forwardRef<HTMLDivElement, InputsGroupProps>((props, ref) => {
  if (props.type === 'number') {
    return <NumberInputsGroup {...props} containerRef={ref} />
  }
  return <TextInputsGroup {...props} containerRef={ref} />
})

InputsGroup.displayName = 'InputsGroup'
