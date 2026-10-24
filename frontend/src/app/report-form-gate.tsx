import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'

import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/api/use-auth'
import type { CurrentUser } from '@/features/auth/types'
import { useCategories } from '@/features/categories/api/use-categories'
import type { Category } from '@/features/categories/types'
import { ReportFormSkeleton } from '@/features/reports/components/report-form-skeleton'

type ReportFormGateProps = {
  children: (context: { currentUser: CurrentUser; categories: Category[] }) => ReactNode
}

// Everything the create and edit pages need before they can show a form: a signed-in user and the
// categories. `reports` cannot import `auth` or `categories`, so the app combines them here.
export function ReportFormGate({ children }: ReportFormGateProps) {
  const location = useLocation()
  const { data: currentUser, isPending } = useCurrentUser()
  const { data: categories, isLoading, error, refetch } = useCategories()

  if (isPending) return <ReportFormSkeleton />

  if (!currentUser) {
    return (
      <div role="status" className="flex max-w-2xl flex-col items-start gap-4 rounded-lg border p-6">
        <div>
          <h2 className="text-xl font-semibold">Sign in to report a problem</h2>
          <p className="mt-2 text-muted-foreground">Only signed-in citizens can send and edit reports.</p>
        </div>
        <Button asChild size="lg" className="h-11 shadow-none">
          <Link to={`/sign-in?from=${encodeURIComponent(location.pathname + location.search)}`}>Sign in</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) return <ReportFormSkeleton />

  if (error || !categories) {
    return (
      <div role="alert" className="flex max-w-2xl flex-col items-start gap-4 rounded-lg border p-6">
        <p>The form could not be loaded. Please check your connection and try again.</p>
        <Button variant="outline" className="h-11 shadow-none" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  return <>{children({ currentUser, categories })}</>
}
