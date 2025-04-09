import { FC, lazy, Suspense } from 'react'
import { Route, RouteProps, Routes as Switch } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import RestrictedRoute from './RestrictedRoute'

export enum RouteType {
  PUBLIC,
  PRIVATE,
  RESTRICTED,
}

type AppRoute = RouteProps & {
  type?: RouteType
}

/* Public routes */
const Home = lazy(() => import('pages/Home'))

/* Private routes */

const Dashboard = lazy(() => import('pages/Dashboard'))
const DashboardUsers = lazy(() => import('pages/Dashboard/Users'))
const DashboardUsersAdd = lazy(() => import('pages/Dashboard/Users/Add'))
const DashboardUsersEdit = lazy(() => import('pages/Dashboard/Users/Edit'))
const DashboardRoles = lazy(() => import('pages/Dashboard/Roles'))
const DashboardRolesAdd = lazy(() => import('pages/Dashboard/Roles/Add'))
const DashboardRolesEdit = lazy(() => import('pages/Dashboard/Roles/Edit'))
const DashboardProducts = lazy(() => import('pages/Dashboard/Products'))
const DashboardProductsAdd = lazy(() => import('pages/Dashboard/Products/Add'))
const DashboardProductsEdit = lazy(
  () => import('pages/Dashboard/Products/Edit'),
)
const DashboardOrders = lazy(() => import('pages/Dashboard/Orders'))

/* Restricted routes */

const Login = lazy(() => import('pages/Login'))
const Register = lazy(() => import('pages/Register'))

/* Error routes */
const Page404 = lazy(() => import('pages/Page404'))

export const AppRoutes: AppRoute[] = [
  // Restricted Routes
  {
    type: RouteType.RESTRICTED,
    path: '/login',
    children: <Login />,
  },
  {
    type: RouteType.RESTRICTED,
    path: '/signup',
    children: <Register />,
  },
  // Private Routes
  {
    type: RouteType.PRIVATE,
    path: '/dashboard',
    children: <Dashboard />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/users',
    children: <DashboardUsers />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/users/add',
    children: <DashboardUsersAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/users/edit',
    children: <DashboardUsersEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/roles',
    children: <DashboardRoles />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/roles/add',
    children: <DashboardRolesAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/roles/edit',
    children: <DashboardRolesEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/products',
    children: <DashboardProducts />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/products/add',
    children: <DashboardProductsAdd />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/products/edit',
    children: <DashboardProductsEdit />,
  },
  {
    type: RouteType.PRIVATE,
    path: '/dashboard/orders',
    children: <DashboardOrders />,
  },
  // Public Routes
  {
    type: RouteType.PUBLIC,
    path: '/',
    children: <Home />,
  },
  // 404 Error
  {
    type: RouteType.PUBLIC,
    path: '*',
    children: <Page404 />,
  },
]

const Routes: FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {AppRoutes.map((r) => {
          const { type } = r
          if (type === RouteType.PRIVATE) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<PrivateRoute>{r.children}</PrivateRoute>}
              />
            )
          }
          if (type === RouteType.RESTRICTED) {
            return (
              <Route
                key={`${r.path}`}
                path={`${r.path}`}
                element={<RestrictedRoute>{r.children}</RestrictedRoute>}
              />
            )
          }

          return (
            <Route key={`${r.path}`} path={`${r.path}`} element={r.children} />
          )
        })}
        <Route path="*" element={<Page404 />} />
      </Switch>
    </Suspense>
  )
}

export default Routes
