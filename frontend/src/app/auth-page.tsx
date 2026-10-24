import type { ReactNode } from 'react'
import { Navigate, useSearchParams } from 'react-router'

import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/features/auth/api/use-auth'

import { readFrom } from './safe-redirect'

type AuthPageProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

// The frame of the sign-in and sign-up pages. A user who is already signed in (or who has just signed
// in) is sent on to the page they came from, so the forms themselves need no redirect.
export function AuthPage({ title, description, children, footer }: AuthPageProps) {
  const [searchParams] = useSearchParams()
  const { data: currentUser, isPending } = useCurrentUser()

  if (isPending) return <Skeleton className="mx-auto h-96 w-full max-w-md" aria-busy="true" />

  if (currentUser) return <Navigate to={readFrom(searchParams) ?? '/'} replace />

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-lg border bg-card p-4 md:p-6">{children}</div>
      <div className="text-sm text-muted-foreground">{footer}</div>
    </section>
  )
}
