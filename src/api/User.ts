import { apiRoutes } from 'constants/apiConstants'
import { LoginUserFields } from 'hooks/react-hook-form/useLogin'
import { UserType } from 'models/auth'
import { RegisterUserFields } from 'hooks/react-hook-form/useRegister'
import { apiRequest } from './Api'
import { CreateUserFields, UpdateUserFields } from 'hooks/react-hook-form/useCreateUpdateUser'

export const fetchUser = async () =>
  apiRequest<undefined, UserType>('get', apiRoutes.FETCH_USER)

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const register = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, UserType>('post', apiRoutes.SIGNUP, data)

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )

export const createUser = async (data:CreateUserFields)=>
  apiRequest<CreateUserFields, void>('post',apiRoutes.USERS_PREFIX,data)

export const updateUser = async (data:UpdateUserFields,id:string)=>
  apiRequest<UpdateUserFields,void>(
    'patch',
    `${apiRoutes.USERS_PREFIX}/${id}`,
    data,
  )

export const deleteUser = async (id:string) =>
  apiRequest<string,UserType>('delete',`${apiRoutes.USERS_PREFIX}/${id}`)

export const fetchUsers = async(pageNumber:number)=>
  apiRequest<number,UserType[]>(
    'get',
    `${apiRoutes.FETCH_USER}?page=${pageNumber}`
  )