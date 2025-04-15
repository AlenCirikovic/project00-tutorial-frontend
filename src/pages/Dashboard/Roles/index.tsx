import DashboardLayout from 'components/ui/DashboardLayout'
import useMediaQuery from 'hooks/useMediaQuery'
import React, { FC, useState } from 'react'
import { Button, Table, Toast, ToastContainer } from 'react-bootstrap'
import { useQuery, useMutation } from 'react-query'
import * as API from 'api/Api'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routesConstants'
import { RoleType } from 'models/role'
import { StatusCode } from 'constants/errorConstants'

const DashboardRoles: FC = () => {
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)
  const { isMobile } = useMediaQuery(768)
  const [pageNumber, setPageNumber] = useState(1)

  const { data, isLoading, refetch } = useQuery(
    ['fetchRoles', pageNumber],
    () => API.fetchPaginatedRoles(pageNumber),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const { mutate } = useMutation((id: string) => API.deleteRole(id), {
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
      setApiError('Something went wrong while deleting a role')
      setShowError(true)
    },
  })

  const handleDelete = (id: string) => {
    mutate(id)
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="mb-4">Role</h1>
        <Link
          className="btn btn-dark"
          to={`${routes.DASHBOARD_PREFIX}/roles/add`}
        >
          Add
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.data.data.length === 0 ? (
            <p>No roles found</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.data.map((item: RoleType, index: number) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>
                        <Link
                          className={
                            isMobile
                              ? 'btn btn-warning btn-sm me-2 mb-2'
                              : 'btn btn-warning btn-sm me-2'
                          }
                          to={`${routes.DASHBOARD_PREFIX}/roles/edit`}
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

export default DashboardRoles
