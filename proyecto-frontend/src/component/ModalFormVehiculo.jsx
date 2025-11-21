/**
 * Componente `ModalFormVehiculo` que representa un modal para agregar o editar vehículos.
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Indica si el modal está abierto.
 * @param {function} props.onClose - Función que se llama para cerrar el modal.
 * @param {"add"|"edit"} props.mode - Define el modo del modal: "add" para agregar, "edit" para editar.
 * @param {Object} [props.vehiculoData] - Datos del vehículo a editar (requerido si mode es "edit").
 * 
 * @returns {JSX.Element} Renderiza un modal con formulario de marca, modelo, placa y estado del vehículo.
 * 
 * @description
 * - Gestiona los estados internos del formulario: marca, modelo, placa y status.
 * - Valida que los campos obligatorios estén completos.
 * - Valida el formato de placa (3 letras y 4 números, ejemplo: ABC1234).
 * - Valida que la placa sea única en la lista de vehículos, ignorando el vehículo actual en modo "edit".
 * - En modo "add", llama a `addVehiculo` del contexto para agregar un vehículo.
 * - En modo "edit", llama a `updateVehiculo` del contexto para actualizar un vehículo.
 * - Reinicia los campos del formulario cuando se abre el modal en modo "add" o al cambiar los datos del vehículo.
 * - Permite cambiar el estado del vehículo entre "Habilitado" e "Inhabilitado".
 */
import { useEffect, useState, useContext } from "react";
import { VehiculoContext } from "../context/VehiculoContext";

export const ModalFormVehiculo = ({ isOpen, onClose, mode, vehiculoData }) => {
    const { addVehiculo, updateVehiculo, vehiculos } = useContext(VehiculoContext);

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [status, setStatus] = useState(true);

    const handleStatusChange = () => {
        setStatus((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones de campos obligatorios
        if (!marca.trim()) {
            alert("La marca es obligatoria");
            return;
        }
        if (!modelo.trim()) {
            alert("El modelo es obligatorio");
            return;
        }

        // Normalización y validación de placa
        const placaRegex = /^[A-Z]{3}[0-9]{4}$/i;
        const placaNormalizada = placa.trim().toUpperCase();

        if (!placaRegex.test(placaNormalizada)) {
            alert("Placa inválida. Debe tener 3 letras y 4 números, ejemplo: ABC1234");
            return;
        }

        const placaExistente = vehiculos.find(v => 
            v.placa === placaNormalizada && !(mode === "edit" && vehiculoData && v.id === vehiculoData.id)
        );

        if (placaExistente) {
            alert(`La placa ${placaNormalizada} ya se encuentra registrada. No es permitido guardar duplicados.`);
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
                setMarca("");
                setModelo("");
                setPlaca("");
                setStatus(true);
            } else if (mode === "edit" && vehiculoData) {
                const isConfirmed = window.confirm("¿Estás seguro de que deseas guardar estos cambios en el vehículo?");
                if (!isConfirmed) return;
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
