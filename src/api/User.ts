import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)
