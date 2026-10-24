import { NotFoundError, delay, starTable } from '@/lib/mock-db'

import type { NewStar, Star, StarsFilters } from '../types'

export class StarAlreadyExistsError extends Error {
  constructor(reportId: number, userId: number) {
    super(`User ${userId} already starred report ${reportId}`)
  }
}

export const starsApi = {
  list: (filters: StarsFilters = {}) => {
    const { reportId, userId } = filters
    return delay(
      starTable
        .rows()
        .filter(
          (s) =>
            (reportId === undefined || s.reportId === reportId) &&
            (userId === undefined || s.userId === userId),
        ),
    )
  },

  get: (id: number) => {
    const star = starTable.rows().find((s) => s.id === id)
    if (!star) return Promise.reject(new NotFoundError('Star', id))
    return delay(star)
  },

  // One star per user and report. The backend also refuses stars on own, unapproved or resolved reports.
  create: (input: NewStar) => {
    if (starTable.rows().some((s) => s.reportId === input.reportId && s.userId === input.userId)) {
      return Promise.reject(new StarAlreadyExistsError(input.reportId, input.userId))
    }
    const star: Star = { ...input, id: Date.now(), createdAt: new Date().toISOString() }
    starTable.add(star)
    return delay(star)
  },

  remove: (id: number) => {
    starTable.remove(id)
    return delay(undefined)
  },
}
