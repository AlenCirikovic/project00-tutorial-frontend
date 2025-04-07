export type UserType = {
  id: string
  first_name: string
  last_name: string
  email: string
  role?: {
    id: string
    name: string
  }
  avatar?: string
}
