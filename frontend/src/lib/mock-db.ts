// In-memory mock "database" shared by all features. Next workshop this file goes away,
// and the functions in src/features/<name>/api/ start calling the real backend.

const DELAY_MS = 400

export const delay = <T>(value: T) => new Promise<T>((resolve) => setTimeout(() => resolve(value), DELAY_MS))

export class NotFoundError extends Error {
  constructor(resource: string, id: number) {
    super(`${resource} with id ${id} does not exist`)
  }
}

// Who starred which report. Shared because `stars` writes it and `reports` computes starCount from it,
// as the real backend will. Nobody stars their own report, and counts match the reports mock.
export type StarRecord = {
  id: number
  reportId: number
  userId: number
  createdAt: string
}

const starSeed: { reportId: number; userIds: number[]; createdAt: string }[] = [
  { reportId: 1, userIds: [4, 5, 6, 7, 8, 9, 10, 2], createdAt: '2026-10-04T09:00:00Z' },
  { reportId: 2, userIds: [3, 5, 6, 7, 8, 9, 1], createdAt: '2026-10-06T08:30:00Z' },
  { reportId: 3, userIds: [3, 4, 6, 7, 8, 9], createdAt: '2026-10-10T19:10:00Z' },
  { reportId: 4, userIds: [3, 4, 5, 7, 8], createdAt: '2026-10-12T10:00:00Z' },
  { reportId: 5, userIds: [3, 4, 5, 6], createdAt: '2026-10-02T12:00:00Z' },
  { reportId: 6, userIds: [3, 4, 5, 7], createdAt: '2026-10-15T08:20:00Z' },
  { reportId: 7, userIds: [3, 4, 5], createdAt: '2026-10-17T11:00:00Z' },
  { reportId: 10, userIds: [3, 4, 6], createdAt: '2026-10-13T09:40:00Z' },
  { reportId: 12, userIds: [4, 6], createdAt: '2026-10-21T14:00:00Z' },
]

let starRows: StarRecord[] = starSeed
  .flatMap(({ reportId, userIds, createdAt }) => userIds.map((userId) => ({ reportId, userId, createdAt })))
  .map((star, index) => ({ ...star, id: index + 1 }))

export const starTable = {
  rows: () => starRows,
  countFor: (reportId: number) => starRows.filter((s) => s.reportId === reportId).length,
  add: (star: StarRecord) => {
    starRows = [...starRows, star]
  },
  remove: (id: number) => {
    starRows = starRows.filter((s) => s.id !== id)
  },
}

// Every account. Shared because `auth` signs people in and registers new ones, `users` lists them and
// `reports` looks up the author of a new report. `password` exists only for accounts created by signing up;
// seeded accounts accept any non-empty password. It is never returned by an API function.
export type UserRecord = {
  id: number
  name: string
  email: string
  role: 'citizen' | 'administrator'
  avatarUrl?: string
  createdAt: string
  password?: string
}

let userRows: UserRecord[] = [
  {
    id: 1,
    name: 'Ana Vukčević',
    email: 'ana.vukcevic@fixmycity.me',
    role: 'administrator',
    avatarUrl: 'https://picsum.photos/seed/user-1/200/200',
    createdAt: '2026-01-12',
  },
  {
    id: 2,
    name: 'Stefan Radulović',
    email: 'stefan.radulovic@fixmycity.me',
    role: 'administrator',
    createdAt: '2026-01-12',
  },
  {
    id: 3,
    name: 'Milica Marković',
    email: 'milica.markovic@example.com',
    role: 'citizen',
    avatarUrl: 'https://picsum.photos/seed/user-3/200/200',
    createdAt: '2026-02-03',
  },
  {
    id: 4,
    name: 'Nikola Đurović',
    email: 'nikola.djurovic@example.com',
    role: 'citizen',
    createdAt: '2026-02-18',
  },
  {
    id: 5,
    name: 'Ivana Knežević',
    email: 'ivana.knezevic@example.com',
    role: 'citizen',
    avatarUrl: 'https://picsum.photos/seed/user-5/200/200',
    createdAt: '2026-03-07',
  },
  {
    id: 6,
    name: 'Luka Bogdanović',
    email: 'luka.bogdanovic@example.com',
    role: 'citizen',
    createdAt: '2026-03-21',
  },
  {
    id: 7,
    name: 'Marija Šćepanović',
    email: 'marija.scepanovic@example.com',
    role: 'citizen',
    avatarUrl: 'https://picsum.photos/seed/user-7/200/200',
    createdAt: '2026-04-09',
  },
  {
    id: 8,
    name: 'Petar Lakićević',
    email: 'petar.lakicevic@example.com',
    role: 'citizen',
    createdAt: '2026-05-14',
  },
  {
    id: 9,
    name: 'Jovana Perović',
    email: 'jovana.perovic@example.com',
    role: 'citizen',
    avatarUrl: 'https://picsum.photos/seed/user-9/200/200',
    createdAt: '2026-06-02',
  },
  {
    id: 10,
    name: 'Vladimir Stanišić',
    email: 'vladimir.stanisic@example.com',
    role: 'citizen',
    createdAt: '2026-08-25',
  },
]

export const userTable = {
  rows: () => userRows,
  add: (user: UserRecord) => {
    userRows = [user, ...userRows]
  },
  update: (id: number, changes: Partial<Omit<UserRecord, 'id'>>) => {
    userRows = userRows.map((u) => (u.id === id ? { ...u, ...changes } : u))
  },
  remove: (id: number) => {
    userRows = userRows.filter((u) => u.id !== id)
  },
}
