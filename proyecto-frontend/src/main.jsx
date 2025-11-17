import { createRoot } from 'react-dom/client'
import { Registro } from './Registro.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Registro />
    </BrowserRouter>
  </React.StrictMode>,
)
