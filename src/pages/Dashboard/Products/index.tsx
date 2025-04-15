import DashboardLayout from 'components/ui/DashboardLayout'
import { routes } from 'constants/routesConstants'
import useMediaQuery from 'hooks/useMediaQuery'
import { FC, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import * as API from 'api/Api'
import { StatusCode } from 'constants/errorConstants'
import { ProductType } from 'models/product'

const DashboardProducts: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const { isMobile } = useMediaQuery(768)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { data, isLoading, refetch } = useQuery(
    ['fetchProducts', pageNumber],
    () => API.fetchProducts(pageNumber),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )
  const { mutate } = useMutation((id: string) => API.deleteProduct(id), {
    onSuccess: (response) => {
      if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
        setApiError(response.data.message)
        setShowError(true)
      } else if (
        response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
      ) {
        setApiError(response.data.message)
        setShowError(true)
      } else {
        refetch()
      }
    },
    onError: () => {
      setApiError('Something went wrong while deleting a product.')
      setShowError(true)
    },
  })

  const handleDelete = async (id: string) => {
    mutate(id)
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="mb-4">Products</h1>
        <Link
          to={`${routes.DASHBOARD_PREFIX}/products/add`}
          className="btn btn-dark"
        >
          Add
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.data.data.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.data.map((item: ProductType, index: number) => (
                    <tr key={index}>
                      <td>
                        <img
                          width={100}
                          src={`${process.env.REACT_APP_API_URL}/files/${item.image}`}
                          alt={item.title}
                        />
                      </td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.price}€</td>
                      <td>
                        <Link
                          className={
                            isMobile
                              ? 'btn btn-warning btn-sm me-2 mb-2'
                              : 'btn btn-warning btn-sm me-2'
                          }
                          to={`${routes.DASHBOARD_PREFIX}/products/edit`}
                          state={{
                            ...item,
                          }}
                        >
                          Edit
                        </Link>
                        <Button
                          className={
                            isMobile ? 'btn-danger mb-2' : 'btn-danger'
                          }
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {data?.data.meta.last_page > 1 && (
                <div>
                  <Button
                    className="me-2"
                    onClick={() => setPageNumber((prev) => prev - 1)}
                    disabled={pageNumber === 1}
                  >
                    Prev page
                  </Button>
                  <Button
                    onClick={() => setPageNumber((prev) => prev + 1)}
                    disabled={pageNumber === data?.data.meta.last_page}
                  >
                    Next page
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
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
    </DashboardLayout>
  )
}

export default DashboardProducts