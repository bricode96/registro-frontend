import { useContext } from 'react';
import { VehiculoContext } from '../context/VehiculoContext'; // Ajusta la ruta a tu contexto

export const TableListVehiculos = ({ handleOpen }) => {
    // 1. Consumir los datos del contexto
    const { vehiculos, loading, error } = useContext(VehiculoContext);

    // 2. Manejo de estados: Carga y Error
    if (loading) {
        return <div className="text-center p-8">Cargando vehículos... 🚗💨</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-error">Error al cargar los datos: {error}</div>;
    }

    if (vehiculos.length === 0) {
        return <div className="text-center p-8">No se encontraron vehículos registrados.</div>;
    }

    // 3. Renderizar la tabla
    return (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table w-full">
                {/* Cabeceras de la tabla */}
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
                    {/* Mapear los vehículos obtenidos del contexto */}
                    {vehiculos.map((vehiculo) => (
                        <tr key={vehiculo.id}>
                            <th>{vehiculo.id}</th>
                            <td>{vehiculo.marca}</td>
                            <td>{vehiculo.modelo}</td>
                            <td>{vehiculo.placa}</td>
                            {/* Formatear las fechas si es necesario, aquí se muestran crudas */}
                            <td>{new Date(vehiculo.created_at).toLocaleDateString()}</td>
                            <td>{new Date(vehiculo.updated_at).toLocaleDateString()}</td>
                            <td>
                                <span className={`badge ${vehiculo.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>
                                    {vehiculo.status}
                                </span>
                            </td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-info"
                                    onClick={() => handleOpen('edit', vehiculo)}
                                >
                                    Editar
                                </button>
                                {/* Puedes agregar más botones como Ver o Eliminar */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};