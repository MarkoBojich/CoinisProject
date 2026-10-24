import type { ReactNode } from 'react'
import { cva } from 'class-variance-authority'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useReports } from '../api/use-reports'
import type { Report, ReportsFilters } from '../types'
import { ReportCard } from './report-card'

type ReportsListProps = {
  filters: ReportsFilters
  renderStar: (report: Report) => ReactNode
}

const gridVariants = cva('grid gap-6 md:grid-cols-2 lg:grid-cols-3', {
  variants: {
    stale: { true: 'opacity-60', false: '' },
  },
})

// Reports with all three states: loading, empty and error.
export function ReportsList({ filters, renderStar }: ReportsListProps) {
  const { data: reports, isLoading, isPlaceholderData, error, refetch } = useReports(filters)

  if (isLoading) {
    return (
      <div className={gridVariants()} aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-96" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-4 rounded-lg border p-6">
        <p>Reports could not be loaded. Please check your connection and try again.</p>
        <Button variant="outline" className="h-11 shadow-none" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <div role="status" className="rounded-lg border p-6">
        <p className="font-semibold">No reports found</p>
        <p className="mt-2 text-muted-foreground">Try a different search word or status.</p>
      </div>
    )
  }

  return (
    <ul className={gridVariants({ stale: isPlaceholderData })} aria-busy={isPlaceholderData}>
      {reports.map((report) => (
        <li key={report.id}>
          <ReportCard report={report} starSlot={renderStar(report)} />
        </li>
      ))}
    </ul>
  )
}
