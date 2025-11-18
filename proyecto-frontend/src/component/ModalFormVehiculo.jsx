import { useEffect, useState, useContext } from "react";
import { VehiculoContext } from "../context/VehiculoContext"; // ⬅️ AGREGADO

export const ModalFormVehiculo = ({ isOpen, onClose, mode, OnSubmit, vehiculoData }) => {

  const { addVehiculo } = useContext(VehiculoContext); // ⬅️ AGREGADO

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [status, setStatus] = useState(true);

  const handleStatusChange = () => {
    setStatus((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newVehiculo = {
        marca,
        modelo,
        placa,
        status,
      };

      // ==========================
      // 🔥 AGREGADO PARA POST REAL
      // ==========================
      if (mode === "add") {
        await addVehiculo(newVehiculo);  // ⬅️ ahora SÍ guarda
      } else {
        await OnSubmit(newVehiculo);     // ⬅️ respetamos tu función para editar
      }

      onClose();

    } catch (error) {
      console.error("Error agregando vehículo", error);
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
