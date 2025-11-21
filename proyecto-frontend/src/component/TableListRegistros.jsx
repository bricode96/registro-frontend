/**
 * Componente `TableListRegistros` que muestra una tabla paginada de registros de vehículos.
 * Permite búsqueda, edición y eliminación de registros.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.searchTerm - Término de búsqueda para filtrar los registros.
 * @param {Function} props.setSearchTerm - Función para actualizar el término de búsqueda.
 * @param {Function} props.handleOpen - Función para abrir el modal de añadir registro.
 * @param {Function} props.handleEdit - Función para abrir el modal de edición de un registro.
 * @param {Function} props.handleDelete - Función para eliminar un registro.
 * @returns {JSX.Element} Renderiza la tabla de registros con controles de búsqueda y paginación.
 */

/* Importación de módulos necesarios */
import { useContext, useState, useMemo, useEffect } from "react";
import { RegistroContext } from "../context/RegistroContext";

/**
 * Función auxiliar para formatear fechas a formato local.
 * @param {string} dateString - Fecha en formato ISO o cadena reconocible por Date.
 * @returns {string} Fecha formateada o "---" si no es válida.
 */
const formatDate = (dateString) => {
    if (!dateString) return "---";
    const d = new Date(dateString);
    return isNaN(d) ? "---" : d.toLocaleDateString();
};

export const TableListRegistros = ({ searchTerm, setSearchTerm, handleOpen, handleEdit, handleDelete }) => {
    const { registros, loading, error } = useContext(RegistroContext);

    /** Página actual para la paginación */
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    /**
     * Filtra los registros según el término de búsqueda.
     * @returns {Array} Lista filtrada de registros.
     */
    const filtered = useMemo(() => {
        return registros.filter(r =>
            r.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.nombre_motorista.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [registros, searchTerm]);

    /** Número total de páginas según el filtrado */
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    /** Ajusta la página actual si se eliminan registros */
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    }, [totalPages, currentPage]);

    /**
     * Datos de la página actual según la paginación.
     * @returns {Array} Registros a mostrar en la página actual.
     */
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage]);

    /** Avanza a la siguiente página */
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    /** Retrocede a la página anterior */
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    /** Mensajes de estado mientras se cargan los datos o no hay resultados */
    if (loading) return <div className="p-8 text-center">Cargando registros...</div>;
    if (error) return <div className="p-8 text-center text-error">Error: {error}</div>;
    if (registros.length === 0) return <div className="p-8 text-center">No hay registros.</div>;
    if (currentData.length === 0) return <div className="p-8 text-center">No hay resultados para la búsqueda.</div>;

    return (
        <>
            {/* Controles de búsqueda y añadir registro */}
            <div className="flex justify-center mt-5 mb-4 items-center gap-x-2">
                <button className='btn btn-warning' onClick={() => handleOpen("add")}>
                    Añadir Registro
                </button>
                <input
                    type="text"
                    placeholder="Buscar por motorista o modelo..."
                    className="input input-bordered w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // Evita que la página se recargue
                        }
                    }}
                />
            </div>

            {/* Tabla de registros */}
            <div className="overflow-x-auto rounded-box border bg-base-150 p-4">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID Salida</th>
                            <th>Motorista</th>
                            <th>Modelo</th>
                            <th>Salida</th>
                            <th>Entrada</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map(r => (
                            <tr key={r.idSalida}>
                                <td>{r.idSalida}</td>
                                <td>{r.nombre_motorista}</td>
                                <td>{r.modelo}</td>
                                <td>{`${formatDate(r.fecha_salida)} ${r.hora_salida || ""}`}</td>
                                <td>{`${formatDate(r.fecha_entrada)} ${r.hora_entrada || ""}`}</td>
                                <td>
                                    <span className={`px-2 py-1 rounded text-white ${r.estado === "Completado" ? "bg-green-500" : "bg-yellow-500"}`}>
                                        {r.estado}
                                    </span>
                                </td>
                                <td className="flex gap-2">
                                    <button className="btn btn-sm btn-info" onClick={() => handleEdit(r)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-sm btn-error" onClick={() => handleDelete(r.idSalida)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 gap-2">
                    <button className="btn btn-sm" onClick={prevPage} disabled={currentPage === 1}>« Anterior</button>
                    <span className="btn btn-sm">Página {currentPage} de {totalPages}</span>
                    <button className="btn btn-sm" onClick={nextPage} disabled={currentPage === totalPages}>Siguiente »</button>
                </div>
            )}
        </>
    );
};
