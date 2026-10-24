import { Link, useSearchParams } from 'react-router'

import { AuthPage } from '@/app/auth-page'
import { fromQuery, readFrom } from '@/app/safe-redirect'
import { SignInForm } from '@/features/auth/components/sign-in-form'

export function SignIn() {
  const [searchParams] = useSearchParams()
  const from = readFrom(searchParams)

  return (
    <AuthPage
      title="Sign in"
      description="Sign in to report problems and to star the ones that matter to you."
      footer={
        <div className="flex flex-col gap-3">
          <p>
            No account yet?{' '}
            <Link
              to={`/sign-up${fromQuery(from)}`}
              className="rounded-sm font-semibold text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Create one
            </Link>
          </p>
          {import.meta.env.DEV && (
            <p className="rounded-lg border border-dashed p-3">
              Mock sign-in, shown only in development. Try milica.markovic@example.com (citizen) or
              ana.vukcevic@fixmycity.me (administrator) with any password.
            </p>
          )}
        </div>
      }
    >
      <SignInForm />
    </AuthPage>
  )
}
