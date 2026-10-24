import { NotFoundError, delay } from '@/lib/mock-db'

import type { Category, NewCategory } from '../types'

let categories: Category[] = [
  { id: 1, name: 'Roads and potholes', slug: 'roads-and-potholes' },
  { id: 2, name: 'Street lighting', slug: 'street-lighting' },
  { id: 3, name: 'Waste and litter', slug: 'waste-and-litter' },
  { id: 4, name: 'Water and sewage', slug: 'water-and-sewage' },
  { id: 5, name: 'Parks and green areas', slug: 'parks-and-green-areas' },
  { id: 6, name: 'Public transport', slug: 'public-transport' },
  { id: 7, name: 'Graffiti and vandalism', slug: 'graffiti-and-vandalism' },
  { id: 8, name: 'Noise', slug: 'noise' },
]

export const categoriesApi = {
  list: () => delay(categories),

  get: (id: number) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return Promise.reject(new NotFoundError('Category', id))
    return delay(category)
  },

  create: (input: NewCategory) => {
    const category: Category = { ...input, id: Date.now() }
    categories = [...categories, category]
    return delay(category)
  },

  update: (id: number, changes: Partial<NewCategory>) => {
    categories = categories.map((c) => (c.id === id ? { ...c, ...changes } : c))
    return categoriesApi.get(id)
  },

  remove: (id: number) => {
    categories = categories.filter((c) => c.id !== id)
    return delay(undefined)
  },
}
