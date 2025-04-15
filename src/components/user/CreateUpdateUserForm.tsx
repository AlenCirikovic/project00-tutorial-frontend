import {
  CreateUserFields,
  UpdateUserFields,
  useCreateUpdateUserForm,
} from 'hooks/react-hook-form/useCreateUpdateUser'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormLabel from 'react-bootstrap/FormLabel'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { observer } from 'mobx-react'
import Avatar from 'react-avatar'
import authStore from 'stores/auth.store'
import { UserType } from 'models/auth'
import { useQuery } from 'react-query'
import { RoleType } from 'models/role'
import { routes } from 'constants/routesConstants'

interface Props {
  defaultValues?: UserType & { isActiveUser?: boolean }
}

const CreateUpdateUserForm: FC<Props> = ({ defaultValues }) => {
  const { data: rolesData } = useQuery(['roles'], API.fetchRoles)
  const { handleSubmit, errors, control } = useCreateUpdateUserForm({
    defaultValues,
  })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(
    async (data: CreateUserFields | UpdateUserFields) => {
      if (!defaultValues) await handleAdd(data as CreateUserFields)
      else await handleUpdate(data as UpdateUserFields)
    },
  )

  const handleAdd = async (data: CreateUserFields) => {
    if (!file) return
    const response = await API.createUser(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      // Upload file
      const formData = new FormData()
      formData.append('avatar', file, file.name)
      const fileResponse = await API.uploadAvatar(formData, response.data.id)
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else {
        navigate(`${routes.DASHBOARD_PREFIX}/users`)
      }
    }
  }

  const handleUpdate = async (data: UpdateUserFields) => {
    const response = await API.updateUser(data, defaultValues?.id as string)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      if (!file) {
        if (defaultValues?.isActiveUser) {
          authStore.login(response.data)
        }
        navigate(`${routes.DASHBOARD_PREFIX}/users`)
        return
      }
      // Upload file
      const formData = new FormData()
      formData.append('avatar', file, file.name)
      const fileResponse = await API.uploadAvatar(formData, response.data.id)
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else {
        if (defaultValues?.isActiveUser) {
          // Get user with avatar image
          const userResponse = await API.fetchUser()
          if (
            userResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
          ) {
            setApiError(userResponse.data.message)
            setShowError(true)
          } else {
            authStore.login(userResponse.data)
          }
        }
        navigate(`${routes.DASHBOARD_PREFIX}/users`)
      }
    }
  }

  const handleFileError = () => {
    if (!file) setFileError(true)
    else setFileError(false)
  }

  const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      const file = target.files[0]
      setFile(file)
    }
  }

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFileError(false)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [file])

  return (
    <>
      <Form className="user-form" onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center align-items-center">
          <FormLabel htmlFor="avatar" id="avatar-p">
            <Avatar
              round
              src={
                preview
                  ? preview
                  : defaultValues &&
                    `${process.env.REACT_APP_API_URL}/files/${defaultValues?.avatar}`
              }
              alt="Avatar"
            />
          </FormLabel>
          <input
            onChange={handleFileChange}
            id="avatar"
            name="avatar"
            type="file"
            aria-label="Avatar"
            aria-describedby="first_name"
            className="d-none"
          />
          {fileError && (
            <div className="d-block invalid-feedback text-danger mb-2 text-center">
              Field avatar is required
            </div>
          )}
        </Form.Group>
        <Controller
          control={control}
          name="first_name"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="first_name">First name</FormLabel>
              <input
                {...field}
                type="first_name"
                aria-label="First name"
                aria-describedby="first_name"
                className={
                  errors.first_name ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.first_name && (
                <div className="invalid-feedback text-danger">
                  {errors.first_name.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="last_name"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="last_name">Last name</FormLabel>
              <input
                {...field}
                type="last_name"
                aria-label="Last name"
                aria-describedby="last_name"
                className={
                  errors.last_name ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.last_name && (
                <div className="invalid-feedback text-danger">
                  {errors.last_name.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="email">Email</FormLabel>
              <input
                {...field}
                type="email"
                placeholder="example@gmail.com"
                aria-label="Email"
                aria-describedby="email"
                className={
                  errors.email ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.email && (
                <div className="invalid-feedback text-danger">
                  {errors.email.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="role_id"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="role_id">Role</FormLabel>
              <Form.Select
                {...field}
                aria-label="Role"
                aria-describedby="role_id"
                className={
                  errors.role_id ? 'form-control is-invalid' : 'form-control'
                }
              >
                <option></option>
                {rolesData?.data.map((role: RoleType, index: number) => (
                  <option key={index} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Form.Select>
              {errors.role_id && (
                <div className="invalid-feedback text-danger">
                  {errors.role_id.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="password">Password</FormLabel>
              <input
                {...field}
                type="password"
                placeholder="******"
                aria-label="Password"
                aria-describedby="password"
                className={
                  errors.password ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.password && (
                <div className="invalid-feedback text-danger">
                  {errors.password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="confirm_password"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="confirm_password">Confirm password</FormLabel>
              <input
                {...field}
                type="password"
                aria-label="Confirm password"
                aria-describedby="confirm_password"
                className={
                  errors.confirm_password
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
              />
              {errors.confirm_password && (
                <div className="invalid-feedback text-danger">
                  {errors.confirm_password.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Button
          className="w-100"
          type="submit"
          onMouseUp={defaultValues ? undefined : handleFileError}
        >
          {defaultValues ? 'Update user' : 'Create new user'}
        </Button>
      </Form>
      {showError && (
        <ToastContainer className="p-3" position="top-end">
          <Toast onClose={() => setShowError(false)} show={showError}>
            <Toast.Header>
              <strong className="me-auto text-danger">Error</strong>
            </Toast.Header>
            <Toast.Body className="text-danger bg-light">{apiError}</Toast.Body>
          </Toast>
        </ToastContainer>
      )}
    </>
  )
}

export default observer(CreateUpdateUserForm)