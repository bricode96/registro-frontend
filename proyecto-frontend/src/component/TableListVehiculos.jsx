import { useContext, useState, useMemo } from 'react';
import { VehiculoContext } from '../context/VehiculoContext';

// Funciones auxiliares (necesarias para evitar Invalid Date y actualizar el status)
const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) {
        return '---';
    }
    return new Date(dateString).toLocaleDateString();
};

export const TableListVehiculos = ({ handleOpen }) => {

    const {
        vehiculos,
        loading,
        error,
        toggleVehiculoStatus
    } = useContext(VehiculoContext);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const listaCompleta = vehiculos;

    const totalPages = Math.ceil(listaCompleta.length / itemsPerPage);


    const currentTableData = useMemo(() => {
        const sorted = [...listaCompleta].sort((a, b) => {
            // Primero los inhabilitados (status false)
            if (a.status === b.status) {
                return a.id - b.id;
            }
            return a.status ? 1 : -1;
        });

        const firstItemIndex = (currentPage - 1) * itemsPerPage;
        const lastItemIndex = firstItemIndex + itemsPerPage;

        return sorted.slice(firstItemIndex, lastItemIndex);
    }, [listaCompleta, currentPage, itemsPerPage]);




    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };


    if (loading) {
        return <div className="text-center p-8">Cargando vehículos... 🚗💨</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-error">Error al cargar los datos: {error}</div>;
    }

    if (vehiculos.length === 0) {
        return <div className="text-center p-8">No se encontraron vehículos registrados.</div>;
    }

    return (
        <>

            <div className='flex justify-center mt-5 mb-4'>
                <button
                    className='btn btn-warning'
                    onClick={() => handleOpen("add")}
                >
                    Añadir Vehículo
                </button>
            </div>

            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                <table className="table w-full">
                    <thead>
                        {/* ... Headers ... */}
                    </thead>
                    <tbody>
                        {currentTableData.map((vehiculo) => (
                            <VehiculoRow
                                key={vehiculo.id}
                                vehiculo={vehiculo}
                                handleOpen={handleOpen}
                                toggleVehiculoStatus={toggleVehiculoStatus}
                            />
                        ))}
                    </tbody>
                </table>
            </div>


            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="join">
                        <button
                            className="join-item btn"
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                        >
                            « Anterior
                        </button>
                        <button className="join-item btn">
                            Página {currentPage} de {totalPages}
                        </button>
                        <button
                            className="join-item btn"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente »
                        </button>
                    </div>
                </div>
            )}
            {/* Fin Controles de Paginación */}
        </>
    );
};



const VehiculoRow = ({ vehiculo, handleOpen, toggleVehiculoStatus }) => {


    const handleToggleStatus = () => {
        toggleVehiculoStatus(vehiculo.id, !vehiculo.status);
    };

    return (
        <tr>
            <th>{vehiculo.id}</th>
            <td>{vehiculo.marca}</td>
            <td>{vehiculo.modelo}</td>
            <td>{vehiculo.placa}</td>
            <td>{formatDate(vehiculo.created_at)}</td>
            <td>{formatDate(vehiculo.updated_at)}</td>

            <td>
                <span
                    className={`px-2 py-1 rounded-full text-white text-sm cursor-pointer ${vehiculo.status ? "bg-green-500" : "bg-yellow-500"
                        }`}
                    onClick={() => handleToggleStatus(vehiculo.id, !vehiculo.status)}
                    title="Click para cambiar estado"
                >
                    {vehiculo.status ? "Habilitado" : "Inhabilitado"}
                </span>
            </td>

            <td>
                <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleOpen("edit", vehiculo)}
                >
                    Editar
                </button>
            </td>
        </tr>
    );
};