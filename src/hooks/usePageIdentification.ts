import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const onDefault = () => {
  document.title = 'Tutorial'
  document.body.id = ''
}
const onHome = () => {
  document.title = 'Tutorial'
  document.body.id = 'home-page'
}
const onDashboard = () => {
  document.title = 'Tutorial - Dashboard'
  document.body.id = 'dashboard-page'
}
const onLogin = () => {
  document.title = 'Tutorial - Login'
  document.body.id = 'login-page'
}
const onSignup = () => {
  document.title = 'Tutorial - Signup'
  document.body.id = 'signup-page'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callbacks: any = {
  '/': [onHome],
  '/dashboard': [onDashboard],
  '/dashboard/users': [onDashboard],
  '/dashboard/users/add': [onDashboard],
  '/dashboard/users/edit': [onDashboard],
  '/dashboard/roles': [onDashboard],
  '/dashboard/roles/add': [onDashboard],
  '/dashboard/roles/edit': [onDashboard],
  '/dashboard/products': [onDashboard],
  '/dashboard/products/add': [onDashboard],
  '/dashboard/products/edit': [onDashboard],
  '/dashboard/orders': [onDashboard],
  '/login': [onLogin],
  '/signup': [onSignup],
  '*': [onDefault],
}

export const addPageIdentification = (_case: string, fn: () => void) => {
  callbacks[_case] = callbacks[_case] || []
  callbacks[_case].push(fn)
}

export const usePageIdentification = () => {
  const location = useLocation()

  const customSwitch = (value: string) => {
    if (callbacks[value]) {
      callbacks[value].forEach((fn: () => void) => {
        fn()
      })
    } else {
      onDefault()
    }
  }

  useEffect(() => {
    if (location.pathname) customSwitch(location.pathname)
  }, [location.pathname])
}
