import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Registro } from './Registro.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Registro />
  </StrictMode>,
)
