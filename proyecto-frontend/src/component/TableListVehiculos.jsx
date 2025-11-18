import { useContext, useState } from 'react';
import { VehiculoContext } from '../context/VehiculoContext';

export const TableListVehiculos = ({ handleOpen }) => {
    const { vehiculos, loading, error } = useContext(VehiculoContext);

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
                        <tr>
                            <th>ID</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Placa</th>
                            <th>Creado en</th>
                            <th>Actualizado en</th>
                            <th>Status</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculos.map((vehiculo) => (
                            <VehiculoRow
                                key={vehiculo.id}
                                vehiculo={vehiculo}
                                handleOpen={handleOpen}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};


// 🔥 Componente separado para evitar hooks dentro del map()
const VehiculoRow = ({ vehiculo, handleOpen }) => {
    const [status, setStatus] = useState(Boolean(vehiculo.status));


    const toggleStatus = () => setStatus(!status);

    return (
        <tr>
            <th>{vehiculo.id}</th>
            <td>{vehiculo.marca}</td>
            <td>{vehiculo.modelo}</td>
            <td>{vehiculo.placa}</td>
            <td>{new Date(vehiculo.created_at).toLocaleDateString()}</td>
            <td>{new Date(vehiculo.updated_at).toLocaleDateString()}</td>

            <td>
                <button
                    className={`btn btn-sm ${status ? "btn-success" : "btn-warning"}`}
                    onClick={toggleStatus}
                >
                    {status ? "Habilitado" : "Inhabilitado"}
                </button>
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
