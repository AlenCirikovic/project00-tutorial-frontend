import {
  CreateUpdateProductFields,
  useCreateUpdateProductForm,
} from 'hooks/react-hook-form/useCreateUpdateProduct'
import { ChangeEvent, FC, useState } from 'react'
import { Controller } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormLabel from 'react-bootstrap/FormLabel'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { routes } from 'constants/routesConstants'
import { ProductType } from 'models/product'

interface Props {
  defaultValues?: ProductType
}

const CreateUpdateProductForm: FC<Props> = ({ defaultValues }) => {
  const { handleSubmit, errors, control } = useCreateUpdateProductForm({
    defaultValues,
  })
  const navigate = useNavigate()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState(false)

  const onSubmit = handleSubmit(
    async (data: CreateUpdateProductFields) => {
      if (!defaultValues) await handleAdd(data)
      else await handleUpdate(data)
    },
  )

  const handleAdd = async (data: CreateUpdateProductFields) => {
    if (!file) return
    const response = await API.createProduct(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      // Upload product image
      const formData = new FormData()
      formData.append('image', file, file.name)
      const fileResponse = await API.uploadProductImage(formData, response.data.id)
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else {
        navigate(`${routes.DASHBOARD_PREFIX}/products`)
      }
    }
  }

  const handleUpdate = async (data: CreateUpdateProductFields) => {
    const response = await API.updateProduct(data, defaultValues?.id as string)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      if (!file) {
        navigate(`${routes.DASHBOARD_PREFIX}/products`)
        return
      }
      // Upload product image
      const formData = new FormData()
      formData.append('image', file, file.name)
      const fileResponse = await API.uploadProductImage(formData, response.data.id)
      if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else if (
        fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(fileResponse.data.message)
        setShowError(true)
      } else {
        navigate(`${routes.DASHBOARD_PREFIX}/products`)
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



  return (
    <>
      <Form className="product-form" onSubmit={onSubmit}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="title">Title</FormLabel>
              <input
                {...field}
                type="title"
                aria-label="Title"
                aria-describedby="title"
                className={
                  errors.title ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.title && (
                <div className="invalid-feedback text-danger">
                  {errors.title.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="description">Description</FormLabel>
              <input
                {...field}
                type="description"
                aria-label="Description"
                aria-describedby="description"
                className={
                  errors.description ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.description && (
                <div className="invalid-feedback text-danger">
                  {errors.description.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <Form.Group className="mb-3">
              <FormLabel htmlFor="price">Price</FormLabel>
              <input
                {...field}
                type="number"
                aria-label="Price"
                aria-describedby="price"
                className={
                  errors.price ? 'form-control is-invalid' : 'form-control'
                }
              />
              {errors.price && (
                <div className="invalid-feedback text-danger">
                  {errors.price.message}
                </div>
              )}
            </Form.Group>
          )}
        />
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='image'>Product image</Form.Label>
          <Form.Control
            onChange={handleFileChange}
            id='image'
            name='image'
            type='file'
            aria-label='Product image'
            aria-describedby='image'
            className={fileError ? 'form-control is-invalid' : 'form-control'}
          />
          {fileError && (
            <div className='d-block invalid-feedback text-danger mb-2'>Field product image is required</div>
          )}
        </Form.Group>
        <Button
          className="w-100"
          type="submit"
          onMouseUp={defaultValues ? undefined : handleFileError}
        >
          {defaultValues ? 'Update product' : 'Create new product'}
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

export default CreateUpdateProductForm