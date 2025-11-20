import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { VehiculoPage } from "./pages/VehiculoPage";
import { RegistroPage } from "./pages/RegistroPage";

// Context Providers
import { VehiculoProvider } from "./context/VehiculoProvider";


export const ControlFlota = () => {
  return (
    <>
      {/* 🔥 Ambos Providers envuelven TODAS las rutas */}
      <VehiculoProvider>
          <Routes>
            {/* Redirección inicial */}
            <Route path="/" element={<Navigate to="/vehiculos" />} />

            {/* Páginas */}
            <Route path="/vehiculos" element={<VehiculoPage />} />
            <Route path="/registro" element={<RegistroPage />} />
          </Routes>
    
      </VehiculoProvider>
    </>
  );
};
