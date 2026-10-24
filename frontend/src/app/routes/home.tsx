import { useState } from 'react'

import { ReportStarSlot } from '@/app/report-star-slot'
import { ReportProblemButton } from '@/components/layout/report-problem-button'
import { useCurrentUser } from '@/features/auth/api/use-auth'
import { ReportsList } from '@/features/reports/components/reports-list'
import { ReportsToolbar } from '@/features/reports/components/reports-toolbar'
import type { ReportsFilters } from '@/features/reports/types'

export function Home() {
  const [filters, setFilters] = useState<ReportsFilters>({ sort: 'newest' })
  const { data: currentUser } = useCurrentUser()
  const currentUserId = currentUser?.id ?? null

  return (
    <section className="flex flex-col gap-6 pb-16 md:pb-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Reported problems</h1>
          <p className="max-w-xl text-muted-foreground">
            Problems reported by citizens. Every report is checked by the city before it appears here.
          </p>
        </div>
        <ReportProblemButton />
      </div>

      <ReportsToolbar filters={filters} onChange={setFilters} />

      <ReportsList
        filters={filters}
        renderStar={(report) => <ReportStarSlot report={report} currentUserId={currentUserId} />}
      />
    </section>
  )
}
