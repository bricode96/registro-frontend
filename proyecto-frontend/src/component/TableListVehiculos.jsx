import { useContext, useState, useMemo, useEffect } from 'react';
import { VehiculoContext } from '../context/VehiculoContext';

// Funciones auxiliares
const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) {
        return '---';
    }
    return new Date(dateString).toLocaleDateString();
};

export const TableListVehiculos = ({ handleOpen }) => {
    const { vehiculos, loading, error, toggleVehiculoStatus, deleteVehiculo } = useContext(VehiculoContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    // Filtrado según search
    const filteredList = useMemo(() => {
        return vehiculos.filter(v =>
            v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.placa.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vehiculos, searchTerm]);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    // 1. AJUSTE DE PAGINACIÓN: Vuelve a la última página válida después de una eliminación.
    useEffect(() => {
        if (currentPage > 1 && totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0) {
            // Si no quedan vehículos, nos aseguramos de estar en la página 1 (que mostrará el mensaje "No se encontraron vehículos").
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // 2. ORDENAMIENTO: Ordena por status (inhabilitados primero) y luego por ID descendente.
    const currentTableData = useMemo(() => {
        const sorted = [...filteredList].sort((a, b) => {
            // Prioridad: Primero los inhabilitados (status false)
            if (a.status === b.status) {
                // Si el status es el mismo, ordena por ID DESCENDENTE
                return b.id - a.id;
            }
            return a.status ? 1 : -1; // Coloca los Inhabilitados (false/-1) antes de los Habilitados (true/1)
        });

        const firstItemIndex = (currentPage - 1) * itemsPerPage;
        const lastItemIndex = firstItemIndex + itemsPerPage;

        return sorted.slice(firstItemIndex, lastItemIndex);
    }, [filteredList, currentPage, itemsPerPage]);

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) return <div className="text-center p-8">Cargando vehículos... 🚗💨</div>;
    if (error) return <div className="text-center p-8 text-error">Error al cargar los datos: {error}</div>;
    if (vehiculos.length === 0 && !searchTerm) return <div className="text-center p-8">No se encontraron vehículos registrados.</div>;
    if (currentTableData.length === 0 && searchTerm) return <div className="text-center p-8">No se encontraron resultados para la búsqueda.</div>;


    return (
        <>
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
                        setCurrentPage(1); // Reinicia la página al buscar
                    }}
                />
            </div>

            {/* 3. DISEÑO DE TABLA: Se restauran las clases de estilo. */}
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

const VehiculoRow = ({ vehiculo, handleOpen, toggleVehiculoStatus, deleteVehiculo }) => {
    const handleToggleStatus = () => toggleVehiculoStatus(vehiculo.id, !vehiculo.status);
    const handleDelete = async () => {
        if (window.confirm(`¿Seguro que quieres eliminar el vehiculo "${vehiculo.marca} ${vehiculo.modelo}"?`))
            try { await deleteVehiculo(vehiculo.id); }
            catch (error) { console.error("Error eliminando vehiculo:", error) }
    };
    //Hello
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