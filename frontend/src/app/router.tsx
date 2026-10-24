import { createBrowserRouter } from 'react-router'

import { EditReport } from '@/app/routes/edit-report'
import { Home } from '@/app/routes/home'
import { NewReport } from '@/app/routes/new-report'
import { NotFound } from '@/app/routes/not-found'
import { Report } from '@/app/routes/report'
import { SignIn } from '@/app/routes/sign-in'
import { SignUp } from '@/app/routes/sign-up'
import { AppLayout } from '@/components/layout/app-layout'
import { AccountMenu } from '@/features/auth/components/account-menu'

export const router = createBrowserRouter([
  {
    element: <AppLayout accountSlot={<AccountMenu />} />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
      { path: '/reports/new', element: <NewReport /> },
      { path: '/reports/:id', element: <Report /> },
      { path: '/reports/:id/edit', element: <EditReport /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
