import { ModalFormVehiculo } from "../component/ModalFormVehiculo";
import { NavBar } from "../component/NavBar";
import { TableListVehiculos } from "../component/TableListVehiculos";
import { useState } from "react";

/**
 * Componente: VehiculoPage
 * ------------------------
 * Página principal para la gestión de vehículos.
 * Permite:
 * - Buscar vehículos
 * - Visualizar la lista de vehículos
 * - Crear un nuevo vehículo
 * - Editar vehículos existentes
 *
 * @component
 * @example
 * return (
 *   <VehiculoPage />
 * )
 */
export const VehiculoPage = () => {
    /** @type {[string, Function]} searchTerm y setSearchTerm para controlar la búsqueda */
    const [searchTerm, setSearchTerm] = useState("");
    /** @type {[boolean, Function]} isOpen controla si el modal está abierto o cerrado */
    const [isOpen, setIsOpen] = useState(false);
    /** @type {[string, Function]} modalMode indica si el modal es "add" o "edit" */
    const [modalMode, setModalMode] = useState("add");
    /** @type {[object|null, Function]} vehiculoData contiene los datos del vehículo a editar */
    const [vehiculoData, setVehiculoData] = useState(null);

    /**
     * Abre el modal en el modo indicado.
     * Si es edición, carga los datos del vehículo.
     * 
     * @param {string} mode "add" para agregar, "edit" para editar
     * @param {object|null} vehiculo Datos del vehículo (opcional)
     */
    const handleOpen = (mode, vehiculo = null) => {
        setModalMode(mode);
        setVehiculoData(vehiculo);
        setIsOpen(true);
    };

    /**
     * Cierra el modal y limpia los datos temporales.
     */
    const handleClose = () => {
        setIsOpen(false);
        setVehiculoData(null);
    };

    /**
     * Función que se ejecuta al enviar el formulario del modal.
     * Actualmente solo imprime en consola y cierra el modal.
     * 
     * @param {object} newVehiculo Datos del vehículo creado o editado
     */
    const handleSubmit = async (newVehiculo) => {
        console.log(modalMode === "add" ? "Agregar Vehículo:" : "Editar Vehículo:", newVehiculo);
        handleClose();
    };

    return (
        <>
            <NavBar setSearchTerm={setSearchTerm} onAdd={() => handleOpen("add")} />

            <div className="mt-5">
                <TableListVehiculos
                    handleOpen={handleOpen}
                    searchTerm={searchTerm}
                />
            </div>

            {/* Modal de creación/edición */}
            <ModalFormVehiculo
                isOpen={isOpen}
                onClose={handleClose}
                mode={modalMode}
                OnSubmit={handleSubmit}
                vehiculoData={vehiculoData}
            />
        </>
    );
};
