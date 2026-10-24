export type Star = {
  id: number
  reportId: number
  userId: number
  createdAt: string
}

// The backend takes userId from the session; the mock needs it in the input.
export type NewStar = Omit<Star, 'id' | 'createdAt'>

export type StarsFilters = {
  reportId?: number
  userId?: number
}
