import { UserType } from 'models/auth'

const user_prefix = 'user'

const userStorage = {
  getUser: (): UserType => {
    if (typeof window === 'undefined') return {} as UserType
    return JSON.parse(
      window.localStorage.getItem(`${user_prefix}`) as string,
    ) as UserType
  },
  setUser: (user: UserType): void => {
    window.localStorage.setItem(`${user_prefix}`, JSON.stringify(user))
  },
  clearUser: (): void => {
    window.localStorage.removeItem(`${user_prefix}`)
  },
}

export { userStorage }
