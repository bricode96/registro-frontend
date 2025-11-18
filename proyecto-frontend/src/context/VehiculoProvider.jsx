import { useEffect, useState } from "react";
import { VehiculoContext } from "./VehiculoContext";
import axios from "axios";

export const VehiculoProvider = ({ children }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ========================
  //    GET VEHÍCULOS
  // ========================
  const fetchVehiculos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://registrovehiculo.onrender.com/api/vehiculos");
      setVehiculos(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vehiculos:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  // ========================
  //       POST VEHÍCULO
  // ========================
  const addVehiculo = async (nuevoVehiculo) => {
    try {
      await axios.post(
        "https://registrovehiculo.onrender.com/api/vehiculos",
        nuevoVehiculo
      );

      // Agrega el nuevo vehículo a la lista sin recargar
      fetchVehiculos();

    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      throw error;
    }
  };

  return (
    <VehiculoContext.Provider 
      value={{ 
        vehiculos, 
        loading, 
        error,
        addVehiculo   // 🔥 <-- lo exponemos aquí
      }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
