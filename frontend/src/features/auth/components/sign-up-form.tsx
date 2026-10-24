import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { EmailAlreadyUsedError } from '../api/auth-api'
import { useSignUp } from '../api/use-auth'
import { AuthFieldError } from './auth-field-error'
import { PasswordField } from './password-field'

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Enter your name, at least 2 characters.')
    .max(60, 'The name can have at most 60 characters.'),
  email: z.string().trim().min(1, 'Enter your email address.').pipe(z.email('Enter a valid email address.')),
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .max(100, 'The password can have at most 100 characters.'),
})

type SignUpValues = z.infer<typeof signUpSchema>

// A new account is signed in right away, and the page reacts to that, so the form needs no success callback.
export function SignUpForm() {
  const signUp = useSignUp()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onSubmit(values: SignUpValues) {
    setFormError(null)
    try {
      await signUp.mutateAsync(values)
    } catch (error) {
      if (error instanceof EmailAlreadyUsedError) {
        setError('email', { message: 'An account with this email already exists.' })
      } else {
        setFormError('Your account could not be created. Please try again.')
      }
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={errors.name !== undefined}
          aria-describedby="name-error"
          className="h-11 shadow-none"
          {...register('name')}
        />
        <AuthFieldError id="name-error" message={errors.name?.message} />
      </div>

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
        hint="At least 8 characters."
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" className="h-11 w-full shadow-none" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
