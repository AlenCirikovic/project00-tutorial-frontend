import { FC } from 'react'
import { Link } from 'react-router-dom'

const Page404: FC = () => {
  return (
    <div className="page-404">
      <h1>
        Nothing found <b>404</b>!
      </h1>
      <Link to="/">Go home</Link>
    </div>
  )
}

export default Page404
