import './App.css'
import { VehiculoPage } from "./pages/VehiculoPage";
import { RegistroPage } from "./pages/RegistroPage";
import { Routes, Route } from "react-router-dom"



export const Registro = () => {
  return (
    <>
    <Routes>
        <Route path="/vehiculos" element={<VehiculoPage />} />
        <Route path="/registro" element={<RegistroPage />} />
      </Routes>
    
    </>
  )
}
