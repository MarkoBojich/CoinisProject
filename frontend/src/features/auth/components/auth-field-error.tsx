type AuthFieldErrorProps = {
  id: string
  message?: string
}

// The message under a form field; `aria-describedby` on the field points at its id.
export function AuthFieldError({ id, message }: AuthFieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  )
}
