import { FC } from 'react'
import Routes from 'routes/Routes'
import { usePageIdentification } from 'hooks/usePageIdentification'
import { observer } from 'mobx-react'

const App: FC = () => {
  usePageIdentification()

  return <Routes />
}

export default observer(App)
