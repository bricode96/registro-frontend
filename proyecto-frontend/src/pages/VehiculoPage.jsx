import { ModalFormVehiculo } from "../component/ModalFormVehiculo";
import { NavBar } from "../component/NavBar"; 
import { TableListVehiculos } from "../component/TableListVehiculos"; // Ajusta la ruta si es necesario
import { useState } from "react";

export const VehiculoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" o "edit"
  const [vehiculoData, setVehiculoData] = useState(null);

  const handleOpen = (mode, vehiculo = null) => {
    setModalMode(mode);
    setVehiculoData(vehiculo);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setVehiculoData(null);
  };

  const handleSubmit = async (newVehiculo) => {
    // Por ahora solo hacemos un console.log, luego se integrará con Render
    console.log(modalMode === "add" ? "Agregar Vehículo:" : "Editar Vehículo:", newVehiculo);
    // Cierra el modal tras enviar
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
