import { CreateUpdateRoleFields, useCreateUpdateRoleForm } from 'hooks/react-hook-form/useCreateUpdateRole'
import { FC, useEffect, useState } from 'react'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import FormLabel from 'react-bootstrap/FormLabel'
import Form from 'react-bootstrap/Form'
import { Controller } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { observer } from 'mobx-react'
import { PermissionType, RoleType } from 'models/role'
import { useQuery } from 'react-query'
import { routes } from 'constants/routesConstants'


interface Props {
  defaultValues?: RoleType
}

interface StatePermissions extends PermissionType {
  defaultChecked: boolean
}


const CreateUpdateRoleForm: FC<Props> = ({ defaultValues }) => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control, register } = useCreateUpdateRoleForm({
    defaultValues
  })
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [statePermissions, setStatePermissions] = useState<StatePermissions[]>([])

  const { data: permissionData } = useQuery(
    ['permissions'],
    API.fetchPermissions,
    {
      refetchOnWindowFocus: false
    }
  )

  const onSubmit = handleSubmit(async (data: CreateUpdateRoleFields) => {
    if (!defaultValues) await handleAdd(data)
    else await handleUpdate(data)

  })

  const handleAdd = async (data: CreateUpdateRoleFields) => {
      const response = await API.createRole(data)
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
        setApiError(response.data.message)
        setShowError(true)
      } else {
        navigate(`${routes.DASHBOARD_PREFIX}/roles`)
      }
  }

  const handleUpdate = async (data: CreateUpdateRoleFields) => {
    const response = await API.updateRole(data, defaultValues?.id as string)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      navigate(`${routes.DASHBOARD_PREFIX}/roles`)
    }
  }

  useEffect(() => {
    if (permissionData?.data.length > 0) {
      const arrayOfPermissions: StatePermissions[] = []
      let includes = false
      if (defaultValues) {
        for (let rootIndex = 0; rootIndex < permissionData.data.length; rootIndex++) {
          for (let nestedIndex = 0; nestedIndex < defaultValues.permissions.length; nestedIndex++) {
            if (permissionData.data[rootIndex].id === defaultValues.permissions[nestedIndex].id) {
              includes = true
            }
          }
          if (includes) {
            arrayOfPermissions.push({
              ...permissionData.data[rootIndex],
              defaultChecked: true,
            })
          } else {
            arrayOfPermissions.push({
              ...permissionData.data[rootIndex],
              defaultChecked: false,
            })
          }
          includes = false
        }
        } else {
          permissionData.data.forEach((p: PermissionType) => {
            arrayOfPermissions.push({
              ...p,
              defaultChecked: false
            })
          })
        }
        setStatePermissions(arrayOfPermissions)
      }
    }, [permissionData, defaultValues])


  return (
    <>
      <Form className="role-form" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="name">Name</FormLabel>
              <input
                {...field}
                type="name"
                aria-label="Name"
                aria-describedby="name"
                className={
                  errors.name ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.name && (
                <div className="invalid-feedback text-danger">
                  {errors.name.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <FormLabel>Permissions</FormLabel>
        <div className='d-flex'>
          {statePermissions.map((permission: StatePermissions, index: number) => (
            <div key={index} className='d-flex me-4'>
              <input
                className='me-2'
                type='checkbox'
                {...register('permissions')}
                value={permission.id}
                defaultChecked={permission.defaultChecked}
              />
              <label>{permission.name}</label>
            </div>
          ))}
          {errors.permissions && (
            <div className='invalid-feedback text-danger'>
              {errors.permissions.message}
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p className="mb-0">Don{'\''}t have an account yet?</p>
          <Link className="text-decoration-none text-end" to="/signup">
            Create account
          </Link>
        </div>
        <Button className="w-100 mt-4" type="submit">
          {defaultValues ? 'Update role' : 'Create new role'}
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

export default observer(CreateUpdateRoleForm)