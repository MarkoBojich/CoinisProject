import { cva } from 'class-variance-authority'
import { CheckCheck, CircleCheck, CircleX, Clock, Wrench, type LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

import type { ReportStatus } from '../types'

const statusBadgeVariants = cva('', {
  variants: {
    status: {
      pending: 'border-border bg-muted text-muted-foreground',
      approved: 'border-transparent bg-info text-info-foreground',
      in_progress: 'border-transparent bg-warning text-warning-foreground',
      resolved: 'border-transparent bg-success text-success-foreground',
      rejected: 'border-transparent bg-destructive text-destructive-foreground',
    },
  },
})

const statusDetails: Record<ReportStatus, { label: string; icon: LucideIcon }> = {
  pending: { label: 'Pending', icon: Clock },
  approved: { label: 'Approved', icon: CircleCheck },
  in_progress: { label: 'In progress', icon: Wrench },
  resolved: { label: 'Resolved', icon: CheckCheck },
  rejected: { label: 'Rejected', icon: CircleX },
}

type ReportStatusBadgeProps = {
  status: ReportStatus
}

// A status is never shown by color alone: every badge has an icon and a text label.
export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  const { label, icon: Icon } = statusDetails[status]

  return (
    <Badge className={statusBadgeVariants({ status })}>
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  )
}
