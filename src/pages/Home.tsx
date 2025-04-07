import Layout from 'components/ui/Layout'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <Layout>
      <div className="p-2 mb-4">
        <div className="container-fluid py-4">
          <h1 className="display-5 fw-bold">Welcome</h1>
          <p className="col-md-8 fs-4">
            In this tutorial you will learn how to use:
          </p>
          <ol>
            <li>react-bootstrap</li>
            <li>react-hook-form with yup validation</li>
            <li>CRUD functionality - Create Read Update Delete</li>
            <li>file upload with NestJS</li>
            <li>connect ReactJS and NestJS</li>
            <li>setup NestJS with custom logging</li>
            <li>connect to PostgreSQL database using TypeORM</li>
            <li>create dtos with validation</li>
            <li>deploy ReactJS to AWS S3 Bucket</li>
            <li>deploy NestJS to AWS ECS (Elastic Container Service)</li>
          </ol>
        </div>
      </div>
    </Layout>
  )
}

export default Home
