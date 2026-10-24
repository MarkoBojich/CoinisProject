import type { ReactNode } from 'react'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router'

import { Card } from '@/components/ui/card'

import type { Report } from '../types'
import { ReportStatusBadge } from './report-status-badge'

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

type ReportCardProps = {
  report: Report
  // The star button belongs to another feature, so the route passes it in.
  starSlot: ReactNode
}

export function ReportCard({ report, starSlot }: ReportCardProps) {
  return (
    <Card className="h-full gap-0 overflow-hidden rounded-lg py-0 shadow-none">
      <img
        src={report.photoUrl}
        alt={`Photo of the problem: ${report.title}`}
        loading="lazy"
        className="aspect-[4/3] w-full bg-muted object-cover"
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <ReportStatusBadge status={report.status} />
          <span className="truncate text-xs text-muted-foreground">{report.category.name}</span>
        </div>
        <h2 className="font-heading text-lg leading-snug font-semibold">
          <Link
            to={`/reports/${report.id}`}
            className="rounded-sm hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {report.title}
          </Link>
        </h2>
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
          {report.address}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <time dateTime={report.createdAt} className="text-sm text-muted-foreground">
            {dateFormat.format(new Date(report.createdAt))}
          </time>
          {starSlot}
        </div>
      </div>
    </Card>
  )
}
