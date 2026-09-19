import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import store from './redux/store/store'
// import store from './redux/store/store'
import reportWebVitals from './reportWebVitals.js'

window.Buffer = Buffer

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)

reportWebVitals()