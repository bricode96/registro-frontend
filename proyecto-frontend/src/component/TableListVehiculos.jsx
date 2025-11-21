/**
 * Componente `TableListVehiculos` que muestra una tabla paginada de vehículos.
 * Permite búsqueda, edición, eliminación y cambio de estado de los vehículos.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.handleOpen - Función que abre el modal para agregar o editar un vehículo.
 * @returns {JSX.Element} Renderiza la tabla de vehículos con controles de búsqueda y paginación.
 */

/* Importación de módulos necesarios */
import { useContext, useState, useMemo, useEffect } from 'react';
import { VehiculoContext } from '../context/VehiculoContext';

/**
 * Función auxiliar para formatear fechas a formato local.
 * @param {string} dateString - Fecha en formato ISO o cadena reconocible por Date.
 * @returns {string} Fecha formateada o '---' si la fecha es inválida.
 */
const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) {
        return '---';
    }
    return new Date(dateString).toLocaleDateString();
};

export const TableListVehiculos = ({ handleOpen }) => {
    const { vehiculos, loading, error, toggleVehiculoStatus, deleteVehiculo } = useContext(VehiculoContext);

    /** Página actual para la paginación */
    const [currentPage, setCurrentPage] = useState(1);
    /** Texto para búsqueda de vehículos */
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    /**
     * Filtra la lista de vehículos según el término de búsqueda.
     * @returns {Array} Lista filtrada de vehículos.
     */
    const filteredList = useMemo(() => {
        return vehiculos.filter(v =>
            v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.placa.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vehiculos, searchTerm]);

    /** Número total de páginas según el filtrado */
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    /** Ajuste de paginación cuando se eliminan vehículos */
    useEffect(() => {
        if (currentPage > 1 && totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    /**
     * Ordena los vehículos por estado (inhabilitados primero) y luego por ID descendente.
     * Calcula los datos actuales para la página.
     * @returns {Array} Vehículos a mostrar en la página actual.
     */
    const currentTableData = useMemo(() => {
        const sorted = [...filteredList].sort((a, b) => {
            if (a.status === b.status) {
                return b.id - a.id;
            }
            return a.status ? 1 : -1;
        });

        const firstItemIndex = (currentPage - 1) * itemsPerPage;
        const lastItemIndex = firstItemIndex + itemsPerPage;

        return sorted.slice(firstItemIndex, lastItemIndex);
    }, [filteredList, currentPage, itemsPerPage]);

    /** Función para ir a la siguiente página */
    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    /** Función para ir a la página anterior */
    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    /** Mensajes de estado mientras se cargan los datos o no hay resultados */
    if (loading) return <div className="text-center p-8">Cargando vehículos... 🚗💨</div>;
    if (error) return <div className="text-center p-8 text-error">Error al cargar los datos: {error}</div>;
    if (vehiculos.length === 0 && !searchTerm) return <div className="text-center p-8">No se encontraron vehículos registrados.</div>;
    if (currentTableData.length === 0 && searchTerm) return <div className="text-center p-8">No se encontraron resultados para la búsqueda.</div>;

    return (
        <>
            {/* Controles de búsqueda y añadir vehículo */}
            <div className="flex justify-center mt-5 mb-4 items-center gap-x-2">
                <button className='btn btn-warning' onClick={() => handleOpen("add")}>
                    Añadir Vehículo
                </button>
                <input
                    type="text"
                    placeholder="Buscar por marca, modelo o placa..."
                    className="input input-bordered w-1/3"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Tabla de vehículos */}
            <div className="overflow-x-auto rounded-box border bg-base-150 p-4">
                <table className="table w-full flex ml-10">
                    <thead>
                        <tr>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Creado</th>
                            <th>Actualizado</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTableData.map((vehiculo) => (
                            <VehiculoRow
                                key={vehiculo.id}
                                vehiculo={vehiculo}
                                handleOpen={handleOpen}
                                toggleVehiculoStatus={toggleVehiculoStatus}
                                deleteVehiculo={deleteVehiculo}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="join">
                        <button className="join-item btn" onClick={goToPrevPage} disabled={currentPage === 1}>« Anterior</button>
                        <button className="join-item btn">Página {currentPage} de {totalPages}</button>
                        <button className="join-item btn" onClick={goToNextPage} disabled={currentPage === totalPages}>Siguiente »</button>
                    </div>
                </div>
            )}
        </>
    );
};

/**
 * Fila de vehículo en la tabla con acciones para editar, eliminar y cambiar estado.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.vehiculo - Datos del vehículo.
 * @param {Function} props.handleOpen - Función para abrir el modal de edición.
 * @param {Function} props.toggleVehiculoStatus - Función para cambiar el estado del vehículo.
 * @param {Function} props.deleteVehiculo - Función para eliminar un vehículo.
 * @returns {JSX.Element} Renderiza una fila de tabla con los datos del vehículo y botones de acción.
 */
const VehiculoRow = ({ vehiculo, handleOpen, toggleVehiculoStatus, deleteVehiculo }) => {
    /** Alterna el estado del vehículo (habilitado/inhabilitado) */
    const handleToggleStatus = () => toggleVehiculoStatus(vehiculo.id, !vehiculo.status);

    /**
     * Elimina un vehículo con confirmación del usuario
     */
    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar el vehiculo "${vehiculo.marca} ${vehiculo.modelo}"?`))
            try { await deleteVehiculo(vehiculo.id); }
            catch (error) { console.error("Error eliminando vehiculo:", error) }
    };

    return (
        <tr>
            <td>{vehiculo.marca}</td>
            <td>{vehiculo.modelo}</td>
            <td>{vehiculo.placa}</td>
            <td>{formatDate(vehiculo.created_at)}</td>
            <td>{formatDate(vehiculo.updated_at)}</td>
            <td>
                <span
                    className={`px-2 py-1 rounded-full text-white text-sm mr-7 cursor-pointer ${vehiculo.status ? "bg-green-500" : "bg-yellow-500"}`}
                    title="Click para cambiar estado"
                    onClick={() => handleToggleStatus()}
                >
                    {vehiculo.status ? "Habilitado" : "Inhabilitado"}
                </span>
            </td>
            <td>
                <div className="flex gap-x-2">
                    <button className="btn btn-sm btn-info" onClick={() => handleOpen("edit", vehiculo)}>Editar</button>
                    <button className="btn btn-sm btn-error" onClick={handleDelete}>Eliminar</button>
                </div>
            </td>
        </tr>
    );
};
