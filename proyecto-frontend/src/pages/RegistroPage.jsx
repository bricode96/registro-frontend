import { useState } from "react";
import { NavBar } from "../component/NavBar";
import { TableListRegistros } from "../component/TableListRegistros";
import { ModalFormRegistro } from "../component/ModalFormRegistro"; // si lo tienes, si no lo comentas

export const RegistroPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [registroData, setRegistroData] = useState(null);

    // Abrir modal
    const handleOpen = (mode, registro = null) => {
        setModalMode(mode);
        setRegistroData(registro);
        setIsOpen(true);
    };

    // Cerrar modal
    const handleClose = () => {
        setIsOpen(false);
        setRegistroData(null);
    };

    // Función para editar
    const handleEdit = (registro) => {
        handleOpen("edit", registro);
    };

    // Función para eliminar
    const handleDelete = (id) => {
        console.log("Eliminar registro ID:", id);
        // Aquí puedes llamar a tu API o cambiar estado a falso
    };

    const handleSubmit = async (data) => {
        console.log(modalMode === "add" ? "Agregar registro:" : "Editar registro:", data);
        handleClose();
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
                OnSubmit={handleSubmit}
                registroData={registroData}
            />
        </>
    );
};
