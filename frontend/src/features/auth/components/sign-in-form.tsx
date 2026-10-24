import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { InvalidCredentialsError } from '../api/auth-api'
import { useSignIn } from '../api/use-auth'
import { AuthFieldError } from './auth-field-error'
import { PasswordField } from './password-field'

const signInSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Enter your password.'),
})

type SignInValues = z.infer<typeof signInSchema>

// Signing in changes the session, and the page reacts to that, so the form needs no success callback.
export function SignInForm() {
  const signIn = useSignIn()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: SignInValues) {
    setFormError(null)
    try {
      await signIn.mutateAsync(values)
    } catch (error) {
      setFormError(
        error instanceof InvalidCredentialsError
          ? 'Email or password is not correct.'
          : 'You could not be signed in. Please try again.',
      )
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={errors.email !== undefined}
          aria-describedby="email-error"
          className="h-11 shadow-none"
          {...register('email')}
        />
        <AuthFieldError id="email-error" message={errors.email?.message} />
      </div>

      <PasswordField
        id="password"
        label="Password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" className="h-11 w-full shadow-none" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  )
}
