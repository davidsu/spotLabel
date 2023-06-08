import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {refreshToken} from './tokenFlow'

const render = () => {
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
  }
if (localStorage.getItem('refresh-token')) {
  refreshToken().then(render)}
else
  render()
