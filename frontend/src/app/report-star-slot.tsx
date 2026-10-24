import type { Report } from '@/features/reports/types'
import { StarButton } from '@/features/stars/components/star-button'
import { StarCount } from '@/features/stars/components/star-count'

type ReportStarSlotProps = {
  report: Report
  currentUserId: number | null
}

// `reports` and `stars` cannot import each other, so the app combines them here for every page that shows
// a report. Only approved and in-progress reports can be starred, and never by their own author.
export function ReportStarSlot({ report, currentUserId }: ReportStarSlotProps) {
  const starrable = report.status === 'approved' || report.status === 'in_progress'

  if (starrable && report.author.id !== currentUserId) {
    return <StarButton reportId={report.id} starCount={report.starCount} currentUserId={currentUserId} />
  }
  return <StarCount count={report.starCount} />
}
