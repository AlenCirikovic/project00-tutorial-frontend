export interface RoleType {
  id: string
  name: string
  permissions: PermissionType[]
}

export interface PermissionType {
  id: string
  name: string
}
