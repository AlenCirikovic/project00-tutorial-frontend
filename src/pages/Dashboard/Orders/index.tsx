import DashboardLayout from 'components/ui/DashboardLayout'
import { FC, Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { useQuery } from 'react-query'
import * as API from 'api/Api'
import { OrderType } from 'models/order'
import axios from 'axios'
import { apiRoutes } from 'constants/apiConstants'

const hide = {
  maxHeight: 0,
  transition: '1s ease in',
}

const show = {
  maxHeight: '150px',
  transition: '1s ease-out',
}

const DashboardOrders: FC = () => {
  const [selected, setSelected] = useState('')
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { data, isLoading } = useQuery(
    ['fetchOrders', pageNumber],
    () => API.fetchOrders(pageNumber),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  )

  const handleView = (id: string) => {
    setSelected(selected !== id ? id : '')
  }

  const handleExport = async () => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}${apiRoutes.ORDERS_PREFIX}/export`,
      {},
      {
        responseType: 'blob'
      }
    )
    const blob = new Blob([data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href = url
    link.download = 'orders.csv'
    link.click()
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="mb-4">Orders</h1>
        <Button className="btn btn-dark" onClick={handleExport}>
          Export
        </Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data?.data.data.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.data.map((item: OrderType) => (
                    <Fragment key={crypto.randomUUID()}>
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.total}</td>
                        <td>
                          <Button className='btn-dark' size='sm' onClick={() => handleView(item.id)}>
                            View
                          </Button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={4}>
                          <div className='overflow-hidden' style={selected === item.id ? show : hide}>
                            <Table className='table-sm' striped bordered hover responsive>
                              <thead>
                                <tr>
                                  <th>Product title</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.order_items.map((orderItem) => (
                                  <tr key={crypto.randomUUID()}>
                                    <td>{orderItem.product_title}</td>
                                    <td>{orderItem.quantity}</td>
                                    <td>{orderItem.price}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            {data?.data.meta.last_page > 1 && (
                              <div>
                                <Button
                                  className='me-2'
                                  onClick={() => setPageNumber((prev) => prev - 1)}
                                  disabled={pageNumber === 1}>
                                    Prev Page
                                </Button>
                                <Button
                                  className='me-2'
                                  onClick={() => setPageNumber((prev) => prev + 1)}
                                  disabled={pageNumber === data?.data.meta.last_page}>
                                    Next Page
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  )
}

export default DashboardOrders
