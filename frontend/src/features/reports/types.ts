export type ReportStatus = 'pending' | 'approved' | 'in_progress' | 'resolved' | 'rejected'

export type ReportAuthor = {
  id: number
  name: string
}

export type ReportCategory = {
  id: number
  name: string
}

export type Report = {
  id: number
  title: string
  description: string
  photoUrl: string
  address: string
  latitude: number
  longitude: number
  category: ReportCategory
  author: ReportAuthor
  status: ReportStatus
  rejectionReason?: string
  starCount: number
  createdAt: string
}

// What a citizen sends. The backend sets status, starCount and createdAt, and takes the author from the session.
export type NewReport = {
  title: string
  description: string
  photoUrl: string
  address: string
  latitude: number
  longitude: number
  categoryId: number
  authorId: number
}

// The administrator changes status and rejectionReason; the author may edit the content while the report is pending.
export type ReportChanges = Partial<NewReport> & {
  status?: ReportStatus
  rejectionReason?: string
}

// Who is looking at a report, or null for a visitor. The route reads it from `auth`.
export type ReportViewer = {
  id: number
  role: 'citizen' | 'administrator'
} | null

export type ReportSort = 'newest' | 'stars'

export type ReportsFilters = {
  search?: string
  status?: ReportStatus | ReportStatus[]
  categoryId?: number
  authorId?: number
  sort?: ReportSort
}
