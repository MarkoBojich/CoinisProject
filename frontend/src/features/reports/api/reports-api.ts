import { NotFoundError, delay, starTable, userTable } from '@/lib/mock-db'

import type {
  NewReport,
  Report,
  ReportAuthor,
  ReportCategory,
  ReportChanges,
  ReportStatus,
  ReportsFilters,
} from '../types'

// Reports embed the author and category name. Authors come from the shared user table (so people who
// signed up can report); the mock keeps its own category lookup because a feature must not import
// `categories`. The backend validates both ids instead.
const categories: ReportCategory[] = [
  { id: 1, name: 'Roads and potholes' },
  { id: 2, name: 'Street lighting' },
  { id: 3, name: 'Waste and litter' },
  { id: 4, name: 'Water and sewage' },
  { id: 5, name: 'Parks and green areas' },
  { id: 6, name: 'Public transport' },
  { id: 7, name: 'Graffiti and vandalism' },
  { id: 8, name: 'Noise' },
]

// Without a status filter only these are returned; pending and rejected reports must be asked for.
const PUBLIC_STATUSES: ReportStatus[] = ['approved', 'in_progress', 'resolved']

function findAuthor(id: number): ReportAuthor {
  const user = userTable.rows().find((u) => u.id === id)
  if (!user) throw new NotFoundError('User', id)
  return { id: user.id, name: user.name }
}

function findCategory(id: number) {
  const category = categories.find((c) => c.id === id)
  if (!category) throw new NotFoundError('Category', id)
  return category
}

const byNewest = (a: Report, b: Report) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
const byStars = (a: Report, b: Report) => b.starCount - a.starCount || byNewest(a, b)

// starCount is never stored: like the backend, the mock counts the star records on every read.
type StoredReport = Omit<Report, 'starCount'>
const withStars = (report: StoredReport): Report => ({ ...report, starCount: starTable.countFor(report.id) })

let reports: StoredReport[] = [
  {
    id: 1,
    title: 'Deep pothole on the Podgorica–Danilovgrad road',
    description:
      'A pothole about 40 cm wide in the right lane just before the Spuž exit. Two cars have already swerved into the oncoming lane to avoid it.',
    photoUrl: 'https://picsum.photos/seed/pothole-danilovgrad/600/450',
    address: 'Podgorica–Danilovgrad road, near Spuž',
    latitude: 42.5201,
    longitude: 19.1752,
    category: { id: 1, name: 'Roads and potholes' },
    author: { id: 3, name: 'Milica Marković' },
    status: 'approved',
    createdAt: '2026-10-02T07:42:00Z',
  },
  {
    id: 2,
    title: 'Water main leaking on Bulevar Svetog Petra Cetinjskog',
    description:
      'Water has been running across both lanes since Monday morning and the pavement is starting to crack. The leak is next to the pedestrian crossing.',
    photoUrl: 'https://picsum.photos/seed/water-main-podgorica/600/450',
    address: 'Bulevar Svetog Petra Cetinjskog 41, Podgorica',
    latitude: 42.4403,
    longitude: 19.249,
    category: { id: 4, name: 'Water and sewage' },
    author: { id: 4, name: 'Nikola Đurović' },
    status: 'in_progress',
    createdAt: '2026-10-05T06:15:00Z',
  },
  {
    id: 3,
    title: 'Streetlights out along Jadranski put',
    description:
      'Six lamps in a row have not worked for two weeks. The stretch between the bus stop and the pharmacy is completely dark after 6 pm.',
    photoUrl: 'https://picsum.photos/seed/streetlights-budva/600/450',
    address: 'Jadranski put, Budva',
    latitude: 42.2878,
    longitude: 18.8359,
    category: { id: 2, name: 'Street lighting' },
    author: { id: 5, name: 'Ivana Knežević' },
    status: 'approved',
    createdAt: '2026-10-09T18:30:00Z',
  },
  {
    id: 4,
    title: 'Overflowing waste containers on Slobode Street',
    description:
      'The containers behind the market have not been emptied for over a week. Bags are piling up on the pavement and the smell reaches the nearby houses.',
    photoUrl: 'https://picsum.photos/seed/waste-niksic/600/450',
    address: 'Slobode Street 12, Nikšić',
    latitude: 42.7731,
    longitude: 18.9445,
    category: { id: 3, name: 'Waste and litter' },
    author: { id: 6, name: 'Luka Bogdanović' },
    status: 'approved',
    createdAt: '2026-10-11T08:05:00Z',
  },
  {
    id: 5,
    title: 'Fallen tree blocking the path in Gorica Park',
    description:
      'A large branch came down after the storm and covers the main walking path near the playground. Children have to walk on the grass around it.',
    photoUrl: 'https://picsum.photos/seed/fallen-tree-gorica/600/450',
    address: 'Gorica Park, Podgorica',
    latitude: 42.4413,
    longitude: 19.2616,
    category: { id: 5, name: 'Parks and green areas' },
    author: { id: 7, name: 'Marija Šćepanović' },
    status: 'resolved',
    createdAt: '2026-10-01T10:20:00Z',
  },
  {
    id: 6,
    title: 'Broken glass in the bus shelter at Kotor bus station',
    description:
      'The side panel of the shelter is shattered and there are glass pieces on the bench. Passengers wait there every morning, including school children.',
    photoUrl: 'https://picsum.photos/seed/bus-shelter-kotor/600/450',
    address: 'Autobuska stanica, Kotor',
    latitude: 42.4218,
    longitude: 18.7712,
    category: { id: 6, name: 'Public transport' },
    author: { id: 8, name: 'Petar Lakićević' },
    status: 'approved',
    createdAt: '2026-10-14T07:10:00Z',
  },
  {
    id: 7,
    title: 'Graffiti covering the school wall on Njegoševa Street',
    description:
      'The whole front wall of the primary school was painted over during the weekend. Some of the writing is offensive and visible from the playground.',
    photoUrl: 'https://picsum.photos/seed/graffiti-cetinje/600/450',
    address: 'Njegoševa Street 8, Cetinje',
    latitude: 42.3931,
    longitude: 18.9237,
    category: { id: 7, name: 'Graffiti and vandalism' },
    author: { id: 9, name: 'Jovana Perović' },
    status: 'approved',
    createdAt: '2026-10-16T09:45:00Z',
  },
  {
    id: 8,
    title: 'Night-time construction noise near Mainski put',
    description:
      'Concrete mixers and a crane have been running from 10 pm to 2 am for the past four nights at the building site next to the apartment blocks.',
    photoUrl: 'https://picsum.photos/seed/construction-budva/600/450',
    address: 'Mainski put, Budva',
    latitude: 42.2931,
    longitude: 18.8603,
    category: { id: 8, name: 'Noise' },
    author: { id: 10, name: 'Vladimir Stanišić' },
    status: 'pending',
    createdAt: '2026-10-22T21:30:00Z',
  },
  {
    id: 9,
    title: 'Barking dogs in a neighbour’s yard',
    description: 'The dogs next door bark all day and I would like the city to do something about it.',
    photoUrl: 'https://picsum.photos/seed/dogs-podgorica/600/450',
    address: 'Zabjelo, Podgorica',
    latitude: 42.4487,
    longitude: 19.2701,
    category: { id: 8, name: 'Noise' },
    author: { id: 4, name: 'Nikola Đurović' },
    status: 'rejected',
    rejectionReason: 'The photo shows private property. Please report problems in public spaces.',
    createdAt: '2026-10-18T15:00:00Z',
  },
  {
    id: 10,
    title: 'Sunken manhole cover on Trg Šaka Petrovića',
    description:
      'The cover sits about 5 cm below the road surface and rattles loudly when cars drive over it. Cyclists have to leave the bike lane to avoid it.',
    photoUrl: 'https://picsum.photos/seed/manhole-niksic/600/450',
    address: 'Trg Šaka Petrovića, Nikšić',
    latitude: 42.7738,
    longitude: 18.9441,
    category: { id: 1, name: 'Roads and potholes' },
    author: { id: 5, name: 'Ivana Knežević' },
    status: 'in_progress',
    createdAt: '2026-10-12T11:25:00Z',
  },
  {
    id: 11,
    title: 'Cracked pavement near the Millennium Bridge',
    description:
      'Several paving slabs on the footpath at the bridge entrance are broken and loose. It is easy to trip, especially in the dark.',
    photoUrl: 'https://picsum.photos/seed/pavement-podgorica/600/450',
    address: 'Millennium Bridge, Podgorica',
    latitude: 42.4412,
    longitude: 19.2546,
    category: { id: 1, name: 'Roads and potholes' },
    author: { id: 6, name: 'Luka Bogdanović' },
    status: 'pending',
    createdAt: '2026-10-23T08:50:00Z',
  },
  {
    id: 12,
    title: 'Overgrown bushes hiding traffic signs at a roundabout',
    description:
      'The bushes on the central island have grown so tall that drivers cannot see the yield sign or cars coming from the left.',
    photoUrl: 'https://picsum.photos/seed/roundabout-bar/600/450',
    address: 'Roundabout on Jadranska Street, Bar',
    latitude: 42.0934,
    longitude: 19.0996,
    category: { id: 5, name: 'Parks and green areas' },
    author: { id: 3, name: 'Milica Marković' },
    status: 'approved',
    createdAt: '2026-10-20T12:40:00Z',
  },
]

export const reportsApi = {
  list: (filters: ReportsFilters = {}) => {
    const { search = '', status, categoryId, authorId, sort = 'newest' } = filters
    const term = search.toLowerCase()
    // No status filter: public statuses only, unless the caller asks for one author's own reports.
    const statuses =
      status === undefined ? (authorId === undefined ? PUBLIC_STATUSES : undefined) : [status].flat()

    const matching = reports
      .map(withStars)
      .filter(
        (r) =>
          (statuses === undefined || statuses.includes(r.status)) &&
          (categoryId === undefined || r.category.id === categoryId) &&
          (authorId === undefined || r.author.id === authorId) &&
          (r.title.toLowerCase().includes(term) || r.address.toLowerCase().includes(term)),
      )
    return delay(matching.toSorted(sort === 'stars' ? byStars : byNewest))
  },

  get: (id: number) => {
    const report = reports.find((r) => r.id === id)
    if (!report) return Promise.reject(new NotFoundError('Report', id))
    return delay(withStars(report))
  },

  create: async (input: NewReport) => {
    const { categoryId, authorId, ...content } = input
    const report: StoredReport = {
      ...content,
      id: Date.now(),
      category: findCategory(categoryId),
      author: findAuthor(authorId),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    reports = [report, ...reports]
    return delay(withStars(report))
  },

  update: async (id: number, changes: ReportChanges) => {
    const { categoryId, authorId, ...rest } = changes
    const category = categoryId === undefined ? undefined : findCategory(categoryId)
    const author = authorId === undefined ? undefined : findAuthor(authorId)
    reports = reports.map((r) =>
      r.id === id ? { ...r, ...rest, category: category ?? r.category, author: author ?? r.author } : r,
    )
    return reportsApi.get(id)
  },

  remove: (id: number) => {
    reports = reports.filter((r) => r.id !== id)
    return delay(undefined)
  },

  // Stands in for `POST /uploads`. The mock returns a temporary address that works only until the page
  // is reloaded; the backend will store the file and return a permanent URL.
  uploadPhoto: (file: File) => delay({ url: URL.createObjectURL(file) }),
}
