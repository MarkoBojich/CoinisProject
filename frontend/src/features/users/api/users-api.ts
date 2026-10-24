import { NotFoundError, delay, userTable, type UserRecord } from '@/lib/mock-db'

import type { NewUser, User, UsersFilters } from '../types'

// The password stays in the mock table and is never part of what the API returns.
const toUser = (record: UserRecord): User => ({
  id: record.id,
  name: record.name,
  email: record.email,
  role: record.role,
  avatarUrl: record.avatarUrl,
  createdAt: record.createdAt,
})

export const usersApi = {
  list: (filters: UsersFilters = {}) => {
    const { search = '', role } = filters
    const term = search.toLowerCase()
    return delay(
      userTable
        .rows()
        .filter((u) => u.name.toLowerCase().includes(term) && (role === undefined || u.role === role))
        .map(toUser),
    )
  },

  get: (id: number) => {
    const user = userTable.rows().find((u) => u.id === id)
    if (!user) return Promise.reject(new NotFoundError('User', id))
    return delay(toUser(user))
  },

  create: (input: NewUser) => {
    const record: UserRecord = { ...input, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }
    userTable.add(record)
    return delay(toUser(record))
  },

  update: (id: number, changes: Partial<NewUser>) => {
    userTable.update(id, changes)
    return usersApi.get(id)
  },

  remove: (id: number) => {
    userTable.remove(id)
    return delay(undefined)
  },
}
