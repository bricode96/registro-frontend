import { useCallback, useEffect, useState } from "react";
import { RegistroContext } from "./RegistroContext";
import axios from "axios";



export const RegistroProvider = ({ children }) => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FETCH registros unificados
    const fetchRegistros = useCallback(async () => {
        try {
            setLoading(true);

            const [salidasRes, entradasRes] = await Promise.all([
                axios.get("https://registrovehiculo.onrender.com/api/registroSalida"),
                axios.get("https://registrovehiculo.onrender.com/api/registroEntrada")
            ]);

            const salidas = salidasRes.data;
            const entradas = entradasRes.data;

            const entradasMap = entradas.reduce((acc, entrada) => {
                acc[entrada.id_salida_fk] = entrada;
                return acc;
            }, {});

            const registrosUnificados = salidas.map(salida => {
                const entrada = entradasMap[salida.id] || null;

                return {
                    idSalida: salida.id,
                    nombre_motorista: salida.nombre_motorista,
                    modelo: salida.modelo,
                    fecha_salida: salida.fecha_salida,
                    hora_salida: salida.hora_salida,
                    kilometraje_salida: salida.kilometraje_salida,
                    fecha_entrada: entrada?.fecha_entrada || null,
                    hora_entrada: entrada?.hora_entrada || null,
                    kilometraje_entrada: entrada?.kilometraje_entrada || null,
                    estado: entrada ? "Completado" : "Pendiente"
                };
            });

            registrosUnificados.sort((a, b) => b.idSalida - a.idSalida);

            setRegistros(registrosUnificados);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching registros:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistros();
    }, [fetchRegistros]);

    // -------------------------
    // CRUD SALIDAS
    // -------------------------
    const addSalida = useCallback(async (nuevo) => {
        try {
            await axios.post("https://registrovehiculo.onrender.com/api/registroSalida", nuevo);
            fetchRegistros();
        } catch (err) {
            console.error("Error al agregar salida:", err);
            throw err;
        }
    }, [fetchRegistros]);

    const updateSalida = useCallback(async (id, datosActualizados) => {
        try {
            await axios.put(`https://registrovehiculo.onrender.com/api/registroSalida/${id}`, datosActualizados);
            fetchRegistros();
        } catch (err) {
            console.error("Error al actualizar salida:", err);
            throw err;
        }
    }, [fetchRegistros]);

    const deleteSalida = useCallback(async (id) => {
        try {
            await axios.delete(`https://registrovehiculo.onrender.com/api/registroSalida/${id}`);
            fetchRegistros();
        } catch (err) {
            console.error("Error al eliminar salida:", err);
            throw err;
        }
    }, [fetchRegistros]);

    // -------------------------
    // CRUD ENTRADAS
    // -------------------------
    const addEntrada = useCallback(async (nuevo) => {
        try {
            await axios.post(`https://registrovehiculo.onrender.com/api/registroEntrada`, nuevo);
            fetchRegistros();
        } catch (err) {
            console.error("Error al agregar entrada:", err);
            throw err;
        }
    }, [fetchRegistros]);

    const updateEntrada = useCallback(async (id, datosActualizados) => {
        try {
            await axios.put(`https://registrovehiculo.onrender.com/api/registroEntrada/${id}`, datosActualizados);
            fetchRegistros();
        } catch (err) {
            console.error("Error al actualizar entrada:", err);
            throw err;
        }
    }, [fetchRegistros]);

    const deleteEntrada = useCallback(async (id) => {
        try {
            await axios.delete(`https://registrovehiculo.onrender.com/api/registroEntrada/${id}`);
            fetchRegistros();
        } catch (err) {
            console.error("Error al eliminar entrada:", err);
            throw err;
        }
    }, [fetchRegistros]);

    return (
        <RegistroContext.Provider
            value={{
                registros,
                loading,
                error,
                fetchRegistros,
                addSalida,
                updateSalida,
                deleteSalida,
                addEntrada,
                updateEntrada,
                deleteEntrada
            }}
        >
            {children}
        </RegistroContext.Provider>
    );
};
