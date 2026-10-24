import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router'

import { cn } from '@/lib/utils'

const links = [{ to: '/', label: 'Home' }]

type AppLayoutProps = {
  // The account menu belongs to `auth`, and layout cannot import features, so the router passes it in.
  accountSlot?: ReactNode
}

export function AppLayout({ accountSlot }: AppLayoutProps) {
  return (
    <div className="min-h-dvh">
      <header className="border-b bg-card">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <span className="font-heading text-lg font-bold text-primary">FixMyCity</span>
          <div className="flex items-center gap-4 md:gap-6">
            <ul className="flex gap-6 text-sm">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end
                    className={({ isActive }) =>
                      cn(
                        'text-muted-foreground hover:text-foreground',
                        isActive && 'font-semibold text-foreground',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            {accountSlot}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
