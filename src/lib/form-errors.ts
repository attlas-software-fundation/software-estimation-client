type ValidationIssueLike = {
  message?: string
}

export const getFieldError = (errors: unknown[]): string => {
  if (errors.length === 0) {
    return ""
  }

  const error = errors[0]
  if (!error) {
    return ""
  }

  if (error instanceof Object && "message" in error) {
    const issue = error as ValidationIssueLike
    return issue.message ? String(issue.message) : ""
  }

  return String(error)
}

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}
