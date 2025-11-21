/**
 * La función `RegistroProvider` es un componente de React que gestiona el estado de los registros
 * mediante la obtención, adición, actualización y eliminación de datos desde los endpoints de la API
 * tanto para salidas como para entradas.
 * 
 * @param {Object} props - Propiedades pasadas al componente.
 * @param {React.ReactNode} props.children - Elementos hijos que serán envueltos por el proveedor de contexto.
 * @returns {JSX.Element} El componente `RegistroProvider` se retorna. Es un componente proveedor de contexto que
 * envuelve a sus hijos con `RegistroContext.Provider`. Proporciona funciones y datos a través del contexto,
 * incluyendo `registros`, `loading`, `error`, `fetchRegistros`, `addSalida`, `updateSalida`, `deleteSalida`,
 * `addEntrada`, `updateEntrada` y `deleteEntrada`.
 */

/* Importación de módulos necesarios */
import { useCallback, useEffect, useState } from "react";
import { RegistroContext } from "./RegistroContext";
import axios from "axios";

export const RegistroProvider = ({ children }) => {

    /** Estado que almacena la lista de registros combinados de salidas y entradas */
    const [registros, setRegistros] = useState([]);
    /** Estado que indica si los datos se están cargando */
    const [loading, setLoading] = useState(true);
    /** Estado que almacena un posible error en la carga de datos */
    const [error, setError] = useState(null);

    /** URL base de la API obtenida desde variables de entorno */
    const API_URL = import.meta.env.VITE_API_URL;

    /**
     * Función que obtiene los registros de salidas y entradas de la API, los unifica y actualiza el estado.
     * @async
     */
    const fetchRegistros = useCallback(async () => {
        try {
            setLoading(true);

            const [salidasRes, entradasRes] = await Promise.all([
                axios.get(`${API_URL}/api/registroSalida`),
                axios.get(`${API_URL}/api/registroEntrada`)
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
    }, [API_URL]);

    /** Hook para cargar los registros al montar el componente */
    useEffect(() => {
        fetchRegistros();
    }, [fetchRegistros]);

    /**
     * Función para agregar una nueva salida a la API.
     * @param {Object} nuevo - Datos de la nueva salida.
     * @async
     */
    const addSalida = useCallback(async (nuevo) => {
        try {
            await axios.post(`${API_URL}/api/registroSalida`, nuevo);
            fetchRegistros();
        } catch (err) {
            console.error("Error al agregar salida:", err);
            throw err;
        }
    }, [API_URL, fetchRegistros]);

    /**
     * Función para actualizar una salida existente en la API.
     * @param {number} id - ID de la salida a actualizar.
     * @param {Object} datosActualizados - Datos actualizados de la salida.
     * @async
     */
    const updateSalida = useCallback(async (id, datosActualizados) => {
        try {
            await axios.put(`${API_URL}/api/registroSalida/${id}`, datosActualizados);
            fetchRegistros();
        } catch (err) {
            console.error("Error al actualizar salida:", err);
            throw err;
        }
    }, [API_URL, fetchRegistros]);

    /**
     * Función para eliminar una salida de la API.
     * @param {number} id - ID de la salida a eliminar.
     * @async
     */
    const deleteSalida = useCallback(async (id) => {
        try {
            await axios.delete(`${API_URL}/api/registroSalida/${id}`);
            fetchRegistros();
        } catch (err) {
            console.error("Error al eliminar salida:", err);
            throw err;
        }
    }, [API_URL, fetchRegistros]);

    /**
     * Función para agregar una nueva entrada a la API.
     * @param {Object} nuevo - Datos de la nueva entrada.
     * @async
     */
    const addEntrada = useCallback(async (nuevo) => {
        try {
            await axios.post(`${API_URL}/api/registroEntrada`, nuevo);
            fetchRegistros();
        } catch (err) {
            console.error("Error al agregar entrada:", err);
            throw err;
        }
    }, [API_URL, fetchRegistros]);

    /**
     * Función para actualizar una entrada existente en la API.
     * @param {number} id - ID de la entrada a actualizar.
     * @param {Object} datosActualizados - Datos actualizados de la entrada.
     * @async
     */
    const updateEntrada = useCallback(async (id, datosActualizados) => {
        try {
            await axios.put(`${API_URL}/api/registroEntrada/${id}`, datosActualizados);
            fetchRegistros();
        } catch (err) {
            console.error("Error al actualizar entrada:", err);
            throw err;
        }
    }, [API_URL, fetchRegistros]);

    /**
     * Función para eliminar una entrada de la API.
     * @param {number} id - ID de la entrada a eliminar.
     * @async
     */
    const deleteEntrada = useCallback(async (id) => {
        try {
            await axios.delete(`${API_URL}/api/registroEntrada/${id}`);
            fetchRegistros();
        } catch (err) {
            console.error("Error al eliminar entrada:", err);
            throw err;
        }
    }, [API_URL, fetchRegistros]);

    /**
     * Se retorna el proveedor de contexto que pasa todas las funciones y estados a los componentes hijos.
     */
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
