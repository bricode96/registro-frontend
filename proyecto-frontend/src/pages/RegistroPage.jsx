import { useState, useContext } from "react";
import { NavBar } from "../component/NavBar";
import { TableListRegistros } from "../component/TableListRegistros";
import { ModalFormRegistro } from "../component/ModalFormRegistro";
import { RegistroContext } from "../context/RegistroContext";

export const RegistroPage = () => {
    const { deleteSalida } = useContext(RegistroContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [registroData, setRegistroData] = useState(null);

    const handleOpen = (mode, registro = null) => {
        setModalMode(mode);
        setRegistroData(registro);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setRegistroData(null);
    };

  const handleEdit = (registro) => {
    // Verifica si el estado es "Completado"
    if (registro.estado === "Completado") {
        alert(`El registro con ID ${registro.idSalida} no se puede editar porque está completado.`);
        return;
    }

    handleOpen("edit", registro); // abrir modal solo si está pendiente
};

    const handleDelete = async (id) => {
        if (window.confirm("¿Deseas eliminar este registro?")) {
            try {
                await deleteSalida(id);
            } catch (err) {
                console.error("Error al eliminar registro:", err);
            }
        }
    };

    return (
        <>
            <NavBar 
                setSearchTerm={setSearchTerm} 
                onAdd={() => handleOpen("add")} 
            />

            <div className="mt-5">
                <TableListRegistros
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleOpen={handleOpen}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </div>

            <ModalFormRegistro
                isOpen={isOpen}
                onClose={handleClose}
                mode={modalMode}
                registroData={registroData}
            />
        </>
    );
};
