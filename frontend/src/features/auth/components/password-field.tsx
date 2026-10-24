import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { AuthFieldError } from './auth-field-error'

type PasswordFieldProps = Omit<ComponentProps<'input'>, 'type' | 'id'> & {
  id: string
  label: string
  hint?: string
  error?: string
}

// A password input with a button that shows or hides what was typed, which is easier on a phone than
// typing the password twice.
export function PasswordField({ id, label, hint, error, ...inputProps }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={error !== undefined}
          aria-describedby={`${id}-hint ${id}-error`}
          className="h-11 pr-12 shadow-none"
          {...inputProps}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          {visible ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <AuthFieldError id={`${id}-error`} message={error} />
    </div>
  )
}
