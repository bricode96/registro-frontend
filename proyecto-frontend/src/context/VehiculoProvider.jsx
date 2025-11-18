import { useEffect, useState } from "react";
import { VehiculoContext } from "./VehiculoContext";
import axios from "axios";

export const VehiculoProvider = ({ children }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET VEHICULOS

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

  // POST VEHICULOS

  const addVehiculo = async (nuevoVehiculo) => {
    try {
      await axios.post(
        "https://registrovehiculo.onrender.com/api/vehiculos",
        nuevoVehiculo
      );

      fetchVehiculos();

    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      throw error;
    }
  };

  // PUT VEHICULO MODALFORM

  const updateVehiculo = async (id, datosActualizados) => {
    try {
      await axios.put(`https://registrovehiculo.onrender.com/api/vehiculos/${id}`, datosActualizados);

      setVehiculos(prev =>
        prev.map(v => (v.id === id ? { ...v, ...datosActualizados } : v))
      );

    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      throw error;
    }
  };

  return (
    <VehiculoContext.Provider
      value={{
        vehiculos,
        loading,
        error,
        addVehiculo,
        updateVehiculo,

      }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
