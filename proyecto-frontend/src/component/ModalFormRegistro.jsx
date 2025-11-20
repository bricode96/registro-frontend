import { useEffect, useState, useContext } from "react";
import { VehiculoContext } from "../context/VehiculoContext";
import { RegistroContext } from "../context/RegistroContext";

export const ModalFormRegistro = ({ isOpen, onClose, mode, registroData }) => {
    const { vehiculos } = useContext(VehiculoContext);
    const { addSalida, updateSalida, addEntrada, updateEntrada  } = useContext(RegistroContext);

    const [vehiculoId, setVehiculoId] = useState("");
    const [nombreMotorista, setNombreMotorista] = useState("");
    const [fechaSalida, setFechaSalida] = useState("");
    const [horaSalida, setHoraSalida] = useState("");
    const [kilometrajeSalida, setKilometrajeSalida] = useState("");
    const [fechaEntrada, setFechaEntrada] = useState("");
    const [horaEntrada, setHoraEntrada] = useState("");
    const [kilometrajeEntrada, setKilometrajeEntrada] = useState("");

    const formatDateForInput = (isoDate) => {
        if (!isoDate) return "";
        const d = new Date(isoDate);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTimeForInput = (timeString) => {
        if (!timeString) return "";
        const parts = timeString.split(":");
        if (parts.length < 2) return "";
        const hour = parts[0].padStart(2, "0");
        const minute = parts[1].padStart(2, "0");
        return `${hour}:${minute}`;
    };

    useEffect(() => {
        if (mode === "edit" && registroData) {
            setVehiculoId(registroData.id_vehiculo_fk || "");
            setNombreMotorista(registroData.nombre_motorista || "");
            setFechaSalida(formatDateForInput(registroData.fecha_salida));
            setHoraSalida(formatTimeForInput(registroData.hora_salida));
            setKilometrajeSalida(registroData.kilometraje_salida || "");
            setFechaEntrada(formatDateForInput(registroData.fecha_entrada));
            setHoraEntrada(formatTimeForInput(registroData.hora_entrada));
            setKilometrajeEntrada(registroData.kilometraje_entrada || "");
        } else {
            setVehiculoId("");
            setNombreMotorista("");
            setFechaSalida("");
            setHoraSalida("");
            setKilometrajeSalida("");
            setFechaEntrada("");
            setHoraEntrada("");
            setKilometrajeEntrada("");
        }
    }, [mode, registroData]);


const handleSubmit = async (e) => {
    e.preventDefault();

    const datosSalida = {
        id_vehiculo_fk: vehiculoId,
        nombre_motorista: nombreMotorista,
        fecha_salida: fechaSalida,
        hora_salida: horaSalida,
        kilometraje_salida: kilometrajeSalida,
        estado: (fechaEntrada || horaEntrada) ? true : false, // Booleano según entrada
    };

    const datosEntrada = {
        fecha_entrada: fechaEntrada || null,
        hora_entrada: horaEntrada || null,
        kilometraje_entrada: kilometrajeEntrada || null,
    };

    try {
        if (mode === "add") {
            await addSalida(datosSalida);
        } else if (mode === "edit") {
            await updateSalida(registroData.idSalida, datosSalida);

            if (fechaEntrada || horaEntrada || kilometrajeEntrada) {
                if (registroData.fecha_entrada) {
                    await updateEntrada(registroData.idSalida, datosEntrada);
                } else {
                    await addEntrada({ id_salida_fk: registroData.idSalida, ...datosEntrada });
                }
            }
        }

        onClose();
    } catch (err) {
        console.error("Error al guardar registro:", err);
    }
};


    return (
        <dialog className="modal" open={isOpen}>
            <div className="modal-box relative">
                <h3 className="font-bold text-lg py-4">
                    {mode === "edit" ? "Editar Registro" : "Agregar Registro"}
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="input input-bordered flex items-center gap-2">
                        Vehículo
                        <select
                            className="grow input input-bordered"
                            value={vehiculoId}
                            onChange={(e) => setVehiculoId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un vehículo</option>
                            {vehiculos.length > 0 ? (
                                vehiculos.map(v => (
                                    <option key={v.id} value={v.id}>
                                        {v.modelo}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No hay vehículos disponibles</option>
                            )}
                        </select>
                    </label>

                    <label className="input input-bordered flex items-center gap-2">
                        Motorista
                        <input
                            type="text"
                            className="grow"
                            value={nombreMotorista}
                            onChange={(e) => setNombreMotorista(e.target.value)}
                            required
                        />
                    </label>

                    <label className="input input-bordered flex items-center gap-2">
                        Fecha de salida
                        <input
                            type="date"
                            className="grow"
                            value={fechaSalida}
                            onChange={(e) => setFechaSalida(e.target.value)}
                            required
                        />
                    </label>

                    <label className="input input-bordered flex items-center gap-2">
                        Hora de salida
                        <input
                            type="time"
                            className="grow"
                            value={horaSalida}
                            onChange={(e) => setHoraSalida(e.target.value)}
                            required
                        />
                    </label>

                    <label className="input input-bordered flex items-center gap-2">
                        Kilometraje salida
                        <input
                            type="number"
                            className="grow"
                            value={kilometrajeSalida}
                            onChange={(e) => setKilometrajeSalida(e.target.value)}
                        />
                    </label>

                    {mode === "edit" && (
                        <>
                            <hr className="my-2" />
                            <h4 className="font-semibold">Datos de Entrada</h4>

                            <label className="input input-bordered flex items-center gap-2">
                                Fecha de entrada
                                <input
                                    type="date"
                                    className="grow"
                                    value={fechaEntrada}
                                    onChange={(e) => setFechaEntrada(e.target.value)}
                                />
                            </label>

                            <label className="input input-bordered flex items-center gap-2">
                                Hora de entrada
                                <input
                                    type="time"
                                    className="grow"
                                    value={horaEntrada}
                                    onChange={(e) => setHoraEntrada(e.target.value)}
                                />
                            </label>

                            <label className="input input-bordered flex items-center gap-2">
                                Kilometraje entrada
                                <input
                                    type="number"
                                    className="grow"
                                    value={kilometrajeEntrada}
                                    onChange={(e) => setKilometrajeEntrada(e.target.value)}
                                />
                            </label>
                        </>
                    )}

                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                    <button type="submit" className="btn btn-primary">
                        {mode === "edit" ? "Guardar Cambios" : "Agregar Registro"}
                    </button>
                </form>
            </div>
        </dialog>
    );
};
