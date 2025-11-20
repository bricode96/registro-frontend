import { useCallback, useEffect, useState } from "react";
import { VehiculoContext } from "./VehiculoContext";
import axios from "axios";

export const VehiculoProvider = ({ children }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchVehiculos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/vehiculos`);
      const vehiculosOrdenados = response.data.sort((a, b) => b.id - a.id);
      setVehiculos(vehiculosOrdenados);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching vehiculos:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  const addVehiculo = useCallback(async (nuevoVehiculo) => {
    try {
      await axios.post(`${API_URL}/api/vehiculos`, nuevoVehiculo);
      fetchVehiculos();
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      throw error;
    }
  }, [API_URL, fetchVehiculos]);

  const updateVehiculo = useCallback(async (id, datosActualizados) => {
    try {
      await axios.put(`${API_URL}/api/vehiculos/${id}`, datosActualizados);
      setVehiculos(prev =>
        prev.map(v => (v.id === id ? { ...v, ...datosActualizados } : v))
      );
    } catch (error) {
      console.error("Error al actualizar vehículo:", error);
      throw error;
    }
  }, [API_URL]);

  const deleteVehiculo = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/api/vehiculos/${id}`);
      setVehiculos(prev => prev.filter(v => v.id !== id));
      fetchVehiculos();
    } catch (error) {
      console.error("Error al eliminar vehículo:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Fallo al eliminar el vehículo en el servidor.");
    }
  }, [API_URL, fetchVehiculos]);

  return (
    <VehiculoContext.Provider
      value={{
        vehiculos,
        loading,
        error,
        addVehiculo,
        updateVehiculo,
        deleteVehiculo
      }}
    >
      {children}
    </VehiculoContext.Provider>
  );
};
