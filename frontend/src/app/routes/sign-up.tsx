import { Link, useSearchParams } from 'react-router'

import { AuthPage } from '@/app/auth-page'
import { fromQuery, readFrom } from '@/app/safe-redirect'
import { SignUpForm } from '@/features/auth/components/sign-up-form'

export function SignUp() {
  const [searchParams] = useSearchParams()
  const from = readFrom(searchParams)

  return (
    <AuthPage
      title="Create an account"
      description="An account lets you report problems in your city and star the ones that matter most."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to={`/sign-in${fromQuery(from)}`}
            className="rounded-sm font-semibold text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <SignUpForm />
    </AuthPage>
  )
}
