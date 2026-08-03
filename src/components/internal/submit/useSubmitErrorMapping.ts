import { useState } from 'react'

export type SubmitErrorMessages = Record<string | number, string>

export interface SubmitErrorMappingOptions<TSubmitError> {
  submitErrorMessages?: SubmitErrorMessages
  getSubmitErrorStatus?: (error: TSubmitError) => string | null
  onUnhandledSubmitError?: (error: TSubmitError) => void
  defaultSubmitErrorMessages?: SubmitErrorMessages
  defaultGetSubmitErrorStatus?: (error: TSubmitError) => string | null
}

function readSubmitErrorStatus<TSubmitError>(
  getStatus: ((error: TSubmitError) => string | null) | undefined,
  error: TSubmitError,
): string | null {
  if (!getStatus) return null
  try {
    return getStatus(error)
  } catch {
    return null
  }
}

export function useSubmitErrorMapping<TSubmitError>({
  submitErrorMessages,
  getSubmitErrorStatus,
  onUnhandledSubmitError,
  defaultSubmitErrorMessages,
  defaultGetSubmitErrorStatus,
}: SubmitErrorMappingOptions<TSubmitError>) {
  const [mappedError, setMappedError] = useState<string | null>(null)

  const resolveSubmitErrorStatus = getSubmitErrorStatus ?? defaultGetSubmitErrorStatus
  const errorMessages = { ...defaultSubmitErrorMessages, ...submitErrorMessages }

  const runAndMapError = async (run: () => void | Promise<void>) => {
    setMappedError(null)
    try {
      await run()
      return true
    } catch (submitError) {
      const status = readSubmitErrorStatus(resolveSubmitErrorStatus, submitError as TSubmitError)
      const message = status === null ? undefined : errorMessages[status]
      if (message !== undefined) {
        setMappedError(message)
        return false
      }
      if (!onUnhandledSubmitError) throw submitError
      onUnhandledSubmitError(submitError as TSubmitError)
      return false
    }
  }

  return { mappedError, runAndMapError }
}
