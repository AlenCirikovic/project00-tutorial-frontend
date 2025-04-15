import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'
import { PermissionType, RoleType } from 'models/role'
import { CreateUpdateRoleFields } from 'hooks/react-hook-form/useCreateUpdateRole'

export const fetchRoles = async () =>
  apiRequest<undefined, RoleType[]>('get', apiRoutes.ROLES_PREFIX)

export const fetchPaginatedRoles = async (pageNumber: number) =>
  apiRequest<undefined, RoleType[]>(
    'get',
    `${apiRoutes.ROLES_PREFIX}/paginated?page=${pageNumber}`,
  )

export const fetchPermissions = async () =>
  apiRequest<undefined, PermissionType[]>('get', apiRoutes.PERMISSIONS_PREFIX)

export const createRole = async (data: CreateUpdateRoleFields) =>
  apiRequest<CreateUpdateRoleFields, RoleType>(
    'post',
    apiRoutes.ROLES_PREFIX,
    data,
  )

export const updateRole = async (data: CreateUpdateRoleFields, id: string) =>
  apiRequest<CreateUpdateRoleFields, RoleType>(
    'patch',
    `${apiRoutes.ROLES_PREFIX}/${id}`,
    data,
  )

export const deleteRole = async (id: string) =>
  apiRequest<string, RoleType>('delete', `${apiRoutes.ROLES_PREFIX}/${id}`)
