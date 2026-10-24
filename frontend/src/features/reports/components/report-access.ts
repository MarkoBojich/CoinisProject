import type { Report, ReportViewer } from '../types'

// Pending and rejected reports are visible only to their author and to administrators.
export function canViewReport(report: Report, viewer: ReportViewer) {
  if (report.status !== 'pending' && report.status !== 'rejected') return true
  return viewer !== null && (viewer.role === 'administrator' || viewer.id === report.author.id)
}

// The author may edit while the report is pending; an administrator always may.
export function canEditReport(report: Report, viewer: ReportViewer) {
  if (viewer === null) return false
  return viewer.role === 'administrator' || (viewer.id === report.author.id && report.status === 'pending')
}
