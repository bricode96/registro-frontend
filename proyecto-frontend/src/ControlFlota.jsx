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
