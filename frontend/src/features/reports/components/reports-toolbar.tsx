import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import type { ReportSort, ReportStatus, ReportsFilters } from '../types'

type StatusFilter = 'all' | Extract<ReportStatus, 'approved' | 'in_progress' | 'resolved'>

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'approved', label: 'Approved' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
]

const sortOptions: { value: ReportSort; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'stars', label: 'Most starred' },
]

const triggerClassName = 'w-full shadow-none data-[size=default]:h-11 md:w-48'

type ReportsToolbarProps = {
  filters: ReportsFilters
  onChange: (filters: ReportsFilters) => void
}

// Search, status filter and sort order. The parent owns the state.
export function ReportsToolbar({ filters, onChange }: ReportsToolbarProps) {
  const status = statusOptions.find((o) => o.value === filters.status)?.value ?? 'all'

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative md:flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          aria-label="Search reports by title or address"
          placeholder="Search by title or address"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="h-11 pl-9 shadow-none"
        />
      </div>
      {/* Side by side on phones; `md:contents` lets them join the toolbar row from `md` up. */}
      <div className="grid grid-cols-2 gap-3 md:contents">
        <Select
          value={status}
          onValueChange={(value) => {
            const option = statusOptions.find((o) => o.value === value)
            if (option) onChange({ ...filters, status: option.value === 'all' ? undefined : option.value })
          }}
        >
          <SelectTrigger aria-label="Filter by status" className={triggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sort ?? 'newest'}
          onValueChange={(value) => {
            const option = sortOptions.find((o) => o.value === value)
            if (option) onChange({ ...filters, sort: option.value })
          }}
        >
          <SelectTrigger aria-label="Sort reports" className={triggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
