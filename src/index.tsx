import 'styles/scss/index.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

export const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
)
