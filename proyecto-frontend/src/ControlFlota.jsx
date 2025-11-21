/**
 * Archivo: ControlFlota.jsx
 * -------------------------
 * Componente principal que organiza la aplicación de control de flota.
 * Gestiona los proveedores de contexto y define las rutas principales.
 *
 * Librerías y componentes utilizados:
 * - react-router-dom:
 *    - Routes: Agrupa todas las rutas de la aplicación.
 *    - Route: Define cada ruta con su componente asociado.
 *    - Navigate: Permite redirigir a otra ruta (ej. "/" a "/vehiculos").
 * - VehiculoPage: Página que muestra y gestiona los vehículos.
 * - RegistroPage: Página que muestra y gestiona los registros de salida/entrada.
 * - VehiculoProvider: Proveedor de contexto para la información de vehículos.
 * - RegistroProvider: Proveedor de contexto para la información de registros.
 *
 * Estructura del componente:
 * 1. VehiculoProvider y RegistroProvider envuelven la aplicación para proporcionar
 *    los datos y funciones a todos los componentes hijos que lo requieran.
 * 2. Las rutas están definidas de la siguiente manera:
 *    - "/" : Redirige automáticamente a "/vehiculos".
 *    - "/vehiculos" : Renderiza el componente VehiculoPage.
 *    - "/registro" : Renderiza el componente RegistroPage.
 *
 * Nota:
 * - Este componente actúa como el "router central" de la aplicación.
 * - Permite que los datos compartidos (vehículos y registros) estén disponibles
 *   para todas las páginas hijas.
 */

import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { VehiculoPage } from "./pages/VehiculoPage";
import { RegistroPage } from "./pages/RegistroPage";
import { VehiculoProvider } from "./context/VehiculoProvider";
import { RegistroProvider } from "./context/RegistroProvider";

export const ControlFlota = () => {
  return (
    <>
      
      <VehiculoProvider>
          <RegistroProvider>
            <Routes>
            <Route path="/" element={<Navigate to="/vehiculos" />} />
            <Route path="/vehiculos" element={<VehiculoPage />} />
            <Route path="/registro" element={<RegistroPage />} />
          </Routes>
          </RegistroProvider>
      </VehiculoProvider>
    </>
  );
};
