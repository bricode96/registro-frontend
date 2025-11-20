import { useContext, useState, useMemo, useEffect } from "react";
import { RegistroContext } from "../context/RegistroContext";

const formatDate = (dateString) => {
    if (!dateString) return "---";
    const d = new Date(dateString);
    return isNaN(d) ? "---" : d.toLocaleDateString();
};

export const TableListRegistros = ({ searchTerm, setSearchTerm, handleOpen, handleEdit, handleDelete }) => {
    const { registros, loading, error } = useContext(RegistroContext);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filtrado
    const filtered = useMemo(() => {
        return registros.filter(r =>
            r.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.nombre_motorista.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [registros, searchTerm]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    // Ajuste de página si se elimina
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages || 1);
    }, [totalPages, currentPage]);

    // Datos para la página actual
    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage]);

    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    if (loading) return <div className="p-8 text-center">Cargando registros...</div>;
    if (error) return <div className="p-8 text-center text-error">Error: {error}</div>;
    if (registros.length === 0) return <div className="p-8 text-center">No hay registros.</div>;
    if (currentData.length === 0) return <div className="p-8 text-center">No hay resultados para la búsqueda.</div>;

    return (
        <>
            {/* Botón y barra de búsqueda */}
            <div className="flex justify-center mt-5 mb-4 items-center gap-x-2">
                <button className='btn btn-warning' onClick={() => handleOpen("add")}>
                    Añadir Registro
                </button>
                <input
                    type="text"
                    placeholder="Buscar por motorista o modelo..."
                    className="input input-bordered w-1/3"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reinicia la página al buscar
                    }}
                />
            </div>

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
