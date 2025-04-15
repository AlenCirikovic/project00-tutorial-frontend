import DashboardLayout from 'components/ui/DashboardLayout'
import CreateUpdateUserForm from 'components/user/CreateUpdateUserForm'
import React, { FC } from 'react'
import { useLocation } from 'react-router-dom'

const DashboardUsersEdit: FC = () => {
  const location = useLocation()
  return (
    <DashboardLayout>
      <h1 className="mb-4 text-center">Edit user</h1>
      <CreateUpdateUserForm defaultValues={location.state} />
    </DashboardLayout>
  )
}

export default DashboardUsersEdit
