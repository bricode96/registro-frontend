/* Las declaraciones `import` en el código se utilizan para importar funcionalidades o componentes específicos desde módulos o archivos externos. Esto es lo que hace cada declaración de importación: */

import { useState, useContext } from "react";
import { NavBar } from "../component/NavBar";
import { TableListRegistros } from "../component/TableListRegistros";
import { ModalFormRegistro } from "../component/ModalFormRegistro";
import { RegistroContext } from "../context/RegistroContext";

export const RegistroPage = () => {
    const { deleteSalida } = useContext(RegistroContext);
/* El fragmento de código que proporcionaste está utilizando el hook `useState` de React para manejar el estado en un componente funcional. Esto es lo que hace cada línea: */

    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [registroData, setRegistroData] = useState(null);
/**
 * La función `handleOpen` establece el modo, los datos y el estado de visibilidad de un modal en un componente de React.
 */

    const handleOpen = (mode, registro = null) => {
        setModalMode(mode);
        setRegistroData(registro);
        setIsOpen(true);
    };

    /**
 * La función `handleClose` establece el estado `isOpen` en false y reinicia el estado `registroData` a null.
 */

    const handleClose = () => {
        setIsOpen(false);
        setRegistroData(null);
    };

    /* La función `handleEdit` en el fragmento de código es responsable de manejar la funcionalidad
   de edición de un registro específico. Aquí se explica lo que hace: */

    const handleEdit = (registro) => {

        if (registro.estado === "Completado") {
            alert(`El registro con ID ${registro.idSalida} no se puede editar porque está completado.`);
            return;
        }

        handleOpen("edit", registro);
    };
    /**
     * La función `handleDelete` solicita al usuario que confirme la eliminación de un registro y luego
     * llama a la función `deleteSalida` para eliminar el registro de forma asincrónica.
     */

    const handleDelete = async (id) => {
        if (window.confirm("¿Deseas eliminar este registro?")) {
            try {
                await deleteSalida(id);
            } catch (err) {
                console.error("Error al eliminar registro:", err);
            }
        }
    };

    /* El componente `<NavBar>` se está renderizando con las siguientes propiedades (props): */
    /* El fragmento de código proporcionado está renderizando el componente `<TableListRegistros>` dentro de
                  un elemento `<div>` con la clase "mt-5". Esto es lo que hace el componente `<TableListRegistros>`
                      con las propiedades (props) que se le pasan: */
    /* El componente `<ModalFormRegistro>` se está renderizando con las siguientes propiedades  */

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
