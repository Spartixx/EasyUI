// Compile-time only: `tsc` is the runner, vitest never picks this file up (it is not `*.test.ts`).
import type {
  FieldValue,
  FormAllValues,
  FormFields,
  FormValues,
  FormVisibleValues,
} from './Form.types'

export const fields = {
  email: { type: 'input', label: 'Email' },
  age: { type: 'number' },
  requiredAge: { type: 'number', isRequired: true },
  country: { type: 'selector', options: [] },
  tags: { type: 'selector', selectionMode: 'multiple', options: [] },
  skills: { type: 'autocomplete', selectionMode: 'multiple', options: [] },
  mentor: { type: 'autocomplete', options: [] },
  aliases: { type: 'inputs-group' },
  amounts: { type: 'inputs-group', itemsType: 'number' },
  note: { type: 'custom', render: () => null },
  city: { type: 'input', dependsOn: { email: null } },
  comment: { type: 'input', isHidden: (values: FormValues) => !values.email },
} satisfies FormFields

type Fields = typeof fields

declare function expectType<TExpected>(value: TExpected): void

export function fieldValueResolvesPerFieldType(
  email: FieldValue<Fields['email']>,
  age: FieldValue<Fields['age']>,
  country: FieldValue<Fields['country']>,
  tags: FieldValue<Fields['tags']>,
  skills: FieldValue<Fields['skills']>,
  mentor: FieldValue<Fields['mentor']>,
  aliases: FieldValue<Fields['aliases']>,
  amounts: FieldValue<Fields['amounts']>,
  note: FieldValue<Fields['note']>,
) {
  expectType<string>(email)
  expectType<number | null>(age)
  expectType<string>(country)
  expectType<string[]>(tags)
  expectType<string[]>(skills)
  expectType<string>(mentor)
  expectType<string[]>(aliases)
  expectType<(number | null)[]>(amounts)
  expectType<string>(note)
}

export function allValuesKeepEveryKeyAndStayNullableBeforeValidation(all: FormAllValues<Fields>) {
  expectType<string>(all.email)
  expectType<number | null>(all.age)
  expectType<number | null>(all.requiredAge)
  expectType<string[]>(all.tags)
  expectType<(number | null)[]>(all.amounts)
  expectType<string>(all.city)
  expectType<string>(all.comment)
}

export function visibleValuesMakeConditionalKeysOptional(values: FormVisibleValues<Fields>) {
  expectType<string>(values.email)
  expectType<string[]>(values.tags)
  expectType<string | undefined>(values.city)
  expectType<string | undefined>(values.comment)
}

export function visibleValuesNarrowRequiredNumbers(values: FormVisibleValues<Fields>) {
  expectType<number>(values.requiredAge)
  expectType<number | null>(values.age)
}

export function submittedInputsGroupsAreFiltered(
  values: FormVisibleValues<Fields>,
  all: FormAllValues<Fields>,
) {
  expectType<number[]>(values.amounts)
  expectType<(number | null)[]>(all.amounts)
  expectType<string[]>(values.aliases)
  expectType<string[]>(all.aliases)
}

export function regressionGuards(
  values: FormVisibleValues<Fields>,
  all: FormAllValues<Fields>,
  age: FieldValue<Fields['age']>,
) {
  // @ts-expect-error a conditional key may be absent from the submitted values
  expectType<string>(values.city)
  // @ts-expect-error a multi-selection field is a list, never a single string
  expectType<string>(values.tags)
  // @ts-expect-error allValues is readable before validation, so it stays nullable
  expectType<number>(all.requiredAge)
  // @ts-expect-error an input field never resolves to the full union
  expectType<string>(age)

  // @ts-expect-error the submitted list is filtered, so it no longer accepts nulls
  const submittedAmounts: typeof values.amounts = [1, null]
  void submittedAmounts
}
