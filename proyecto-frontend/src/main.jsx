import { createRoot } from 'react-dom/client'
import { ControlFlota } from './ControlFlota.jsx'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ControlFlota />
    </BrowserRouter>
  </React.StrictMode>,
)
