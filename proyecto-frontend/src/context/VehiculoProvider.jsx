import { useCallback, useEffect, useState } from "react";
import { VehiculoContext } from "./VehiculoContext";
import axios from "axios";

/**
 * Componente proveedor que maneja el estado de los vehículos y provee funciones para
 * interactuar con la API de vehículos.
 * 
 * @component
 * @param {Object} props - Props del componente.
 * @param {React.ReactNode} props.children - Componentes hijos que recibirán el contexto.
 * @returns {JSX.Element} VehiculoContext.Provider que envuelve a los hijos y provee estado y funciones.
 */
export const VehiculoProvider = ({ children }) => {
  /** @type {[Array, Function]} Estado que almacena la lista de vehículos */
  const [vehiculos, setVehiculos] = useState([]);
  /** @type {[boolean, Function]} Estado que indica si se está cargando la información */
  const [loading, setLoading] = useState(true);
  /** @type {[string|null, Function]} Estado que almacena un mensaje de error si ocurre */
  const [error, setError] = useState(null);

  /** URL base de la API */
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Función que obtiene todos los vehículos desde la API y actualiza el estado.
   * Ordena los vehículos por id descendente.
   */
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

  // Llama a fetchVehiculos al montar el componente
  useEffect(() => {
    fetchVehiculos();
  }, [fetchVehiculos]);

  /**
   * Agrega un nuevo vehículo a la base de datos mediante la API.
   * @param {Object} nuevoVehiculo - Objeto con los datos del vehículo a agregar.
   */
  const addVehiculo = useCallback(async (nuevoVehiculo) => {
    try {
      await axios.post(`${API_URL}/api/vehiculos`, nuevoVehiculo);
      fetchVehiculos();
    } catch (error) {
      console.error("Error al agregar vehículo:", error);
      throw error;
    }
  }, [API_URL, fetchVehiculos]);

  /**
   * Actualiza un vehículo existente mediante la API.
   * @param {number} id - ID del vehículo a actualizar.
   * @param {Object} datosActualizados - Datos a actualizar del vehículo.
   */
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

  /**
   * Elimina un vehículo existente mediante la API.
   * @param {number} id - ID del vehículo a eliminar.
   * @throws {Error} Lanza error si la eliminación falla.
   */
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
