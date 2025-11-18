import { NavBar } from "../component/NavBar"; 
import { TableListVehiculos } from "../component/TableListVehiculos"; // Asegúrate de la ruta
import { useState } from "react";

export const VehiculoPage = () => {
    // El searchTerm y handleOpen seguirán siendo necesarios para la NavBar y los botones
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (mode, vehiculo) => {
        console.log("Abrir modal:", mode, vehiculo);
        // Aquí iría la lógica para mostrar el modal de edición/creación
    };

    return (
        <>
            <NavBar setSearchTerm={setSearchTerm} />
            <div className="mt-5">
                {/* La tabla ahora obtiene todos sus datos del Contexto */}
                <TableListVehiculos 
                    handleOpen={handleOpen} 
                    // Nota: Si quieres que el filtrado se haga por el searchTerm, 
                    // la lógica de filtrado debe estar dentro de VehiculoProvider o VehiculoPage, 
                    // y solo pasarías los vehículos filtrados a TableListVehiculos.
                />
            </div>
        </>
    );
};