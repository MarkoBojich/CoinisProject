export type Category = {
  id: number
  name: string
  slug: string
}

export type NewCategory = Omit<Category, 'id'>
