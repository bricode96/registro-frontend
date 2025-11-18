import { useEffect, useState, useContext } from "react";
import { VehiculoContext } from "../context/VehiculoContext";

export const ModalFormVehiculo = ({ isOpen, onClose, mode, vehiculoData }) => {
    const { addVehiculo, updateVehiculo } = useContext(VehiculoContext);

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [status, setStatus] = useState(true);

    const handleStatusChange = () => {
        setStatus((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!marca.trim()) {
            alert("La marca es obligatoria");
            return;
        }
        if (!modelo.trim()) {
            alert("El modelo es obligatorio");
            return;
        }
        const placaRegex = /^[A-Z]{3}[0-9]{4}$/i;
        if (!placaRegex.test(placa.trim())) {
            alert("Placa inválida. Debe tener 3 letras y 4 números, ejemplo: ABC1234");
            return;
        }

        try {
            const datosVehiculo = {
                marca,
                modelo,
                placa: placa.toUpperCase(),
                status,
            };

            if (mode === "add") {
                await addVehiculo(datosVehiculo);
            } else if (mode === "edit" && vehiculoData) {
                await updateVehiculo(vehiculoData.id, datosVehiculo);
            }

            onClose();
        } catch (error) {
            console.error("Error al guardar vehículo", error);
        }
    };

    useEffect(() => {
        if (mode === "edit" && vehiculoData) {
            setMarca(vehiculoData.marca || "");
            setModelo(vehiculoData.modelo || "");
            setPlaca(vehiculoData.placa || "");
            setStatus(vehiculoData.status ?? true);
        } else {
            setMarca("");
            setModelo("");
            setPlaca("");
            setStatus(true);
        }
    }, [mode, vehiculoData]);

    return (
        <dialog className="modal" open={isOpen}>
            <div className="modal-box relative">
                <h3 className="font-bold text-lg py-4">
                    {mode === "edit" ? "Editar Vehículo" : "Agregar Vehículo"}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="input input-bordered flex items-center gap-2">
                        Marca
                        <input
                            type="text"
                            className="grow"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            required
                        />
                    </label>

                    <label className="input input-bordered flex items-center gap-2">
                        Modelo
                        <input
                            type="text"
                            className="grow"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            required
                        />
                    </label>

                    <label className="input input-bordered flex items-center gap-2">
                        Placa
                        <input
                            type="text"
                            className="grow"
                            value={placa}
                            onChange={(e) => setPlaca(e.target.value)}
                            required
                        />
                    </label>

                    <button
                        type="button"
                        className={`btn ${status ? "btn-success" : "btn-warning"}`}
                        onClick={handleStatusChange}
                    >
                        {status ? "Habilitado" : "Inhabilitado"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                    <button type="submit" className="btn btn-primary">
                        {mode === "edit" ? "Guardar Cambios" : "Agregar Vehículo"}
                    </button>
                </form>
            </div>
        </dialog>
    );
};
