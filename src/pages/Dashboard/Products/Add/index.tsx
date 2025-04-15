import CreateUpdateProductForm from 'components/product/CreateUpdateProductForm/CreateUpdateProductForm'
import DashboardLayout from 'components/ui/DashboardLayout'
import { FC } from 'react'

const DashboardProductsAdd: FC = () => {
  return <DashboardLayout>
    <h1 className="mb-4 text-center">Create new product</h1>
    <CreateUpdateProductForm />
  </DashboardLayout>
}

export default DashboardProductsAdd
