import { useEffect, useState } from "react";
import { VehiculoContext } from "./VehiculoContext"; // asegúrate de la ruta
import axios from "axios";

export const VehiculoProvider = ({ children }) => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchVehiculos();
  }, []);

  return (
    <VehiculoContext.Provider value={{ vehiculos, loading, error }}>
      {children}
    </VehiculoContext.Provider>
  );
};
