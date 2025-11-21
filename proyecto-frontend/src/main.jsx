/**
 * Archivo: main.jsx
 * -----------------
 * Punto de entrada de la aplicación React.
 * Renderiza la aplicación dentro del elemento HTML con id "root".
 * 
 * Componentes y librerías:
 * - React: Librería principal para construir la interfaz.
 * - createRoot: Método de React 18 para renderizar la app en el DOM.
 * - BrowserRouter: Provee rutas basadas en el historial del navegador.
 * - ControlFlota: Componente principal de la aplicación.
 *
 * Uso de React.StrictMode:
 * - Ayuda a detectar problemas potenciales en la aplicación durante el desarrollo.
 */

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
