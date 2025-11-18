import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { VehiculoPage } from "./pages/VehiculoPage";
import { RegistroPage } from "./pages/RegistroPage";

// ⬅️ Importamos el Proveedor de Contexto
import { VehiculoProvider } from "../src/context/VehiculoProvider"; 

export const ControlFlota = () => {
  return (
    <>
      {/* 1. Envolver las rutas o el componente que necesita los datos */}
      <VehiculoProvider> 
        <Routes>
          {/* Redirección de la raíz a /vehiculos */}
          <Route path="/" element={<Navigate to="/vehiculos" />} /> 
          
          {/* VehiculoPage y sus hijos (TableListVehiculos) ahora tienen acceso a los datos del contexto */}
          <Route path="/vehiculos" element={<VehiculoPage />} /> 
          
          {/* Si RegistroPage no necesita datos de vehículos, no pasa nada que esté dentro del Provider */}
          <Route path="/registro" element={<RegistroPage />} />
        </Routes>
      </VehiculoProvider> 
    </>
  );
}