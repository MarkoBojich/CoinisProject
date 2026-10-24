import type { ReactNode } from 'react'
import { ArrowLeft, MapPin, Pencil } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { NotFoundError } from '@/lib/mock-db'

import { useReport } from '../api/use-reports'
import type { Report, ReportViewer } from '../types'
import { canEditReport, canViewReport } from './report-access'
import { ReportDetailSkeleton } from './report-detail-skeleton'
import { ReportMap } from './report-map'
import { ReportNotAvailable } from './report-not-available'
import { ReportStatusBadge } from './report-status-badge'

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })

type ReportDetailProps = {
  reportId: number
  viewer: ReportViewer
  // The star button belongs to another feature, so the route passes it in.
  renderStar: (report: Report) => ReactNode
}

// One report with all states: loading, not available and error.
export function ReportDetail({ reportId, viewer, renderStar }: ReportDetailProps) {
  const { data: report, isLoading, error, refetch } = useReport(reportId)

  if (isLoading) return <ReportDetailSkeleton />

  if (error instanceof NotFoundError) return <ReportNotAvailable />

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-start gap-4 rounded-lg border p-6">
        <p>The report could not be loaded. Please check your connection and try again.</p>
        <Button variant="outline" className="h-11 shadow-none" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!report || !canViewReport(report, viewer)) return <ReportNotAvailable />

  return (
    <article className="flex flex-col gap-6">
      <Link
        to="/"
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md text-sm font-semibold text-primary hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All reports
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8">
        <header className="flex flex-col gap-3 lg:col-start-2 lg:row-start-1">
          <div className="flex flex-wrap items-center gap-2">
            <ReportStatusBadge status={report.status} />
            <span className="text-sm text-muted-foreground">{report.category.name}</span>
          </div>
          <h1 className="text-2xl font-bold md:text-3xl">{report.title}</h1>
          <p className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-1 size-4 shrink-0" aria-hidden="true" />
            {report.address}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {renderStar(report)}
            {canEditReport(report, viewer) && (
              <Button asChild variant="outline" className="h-11 shadow-none">
                <Link to={`/reports/${report.id}/edit`}>
                  <Pencil aria-hidden="true" />
                  Edit report
                </Link>
              </Button>
            )}
          </div>
          {report.status === 'rejected' && report.rejectionReason && (
            <div className="rounded-lg border border-destructive p-4 text-sm">
              <p className="font-semibold">Why this report was rejected</p>
              <p className="mt-1">{report.rejectionReason}</p>
            </div>
          )}
        </header>

        <div className="flex flex-col gap-6 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <img
            src={report.photoUrl}
            alt={`Photo of the problem: ${report.title}`}
            className="aspect-[4/3] w-full rounded-lg border bg-muted object-cover"
          />
          <section aria-labelledby="report-description">
            <h2 id="report-description" className="text-lg font-semibold">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line">{report.description}</p>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-start-2 lg:row-start-2">
          <ReportMap latitude={report.latitude} longitude={report.longitude} />
          <dl className="grid gap-3 rounded-lg border p-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Reported by</dt>
              <dd className="font-semibold">{report.author.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reported on</dt>
              <dd className="font-semibold">
                <time dateTime={report.createdAt}>{dateTimeFormat.format(new Date(report.createdAt))}</time>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  )
}
