import { useState } from "react";

export default function ModalCrearEvento({ onClose, onCrear }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [color, setColor] = useState("#2563eb");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo || !fechaInicio || !fechaFin) {
      alert("Por favor completá todos los campos requeridos.");
      return;
    }

    // ✅ Enviar strings (no new Date) para evitar desfases horarios
    onCrear({
      title: titulo,
      descripcion,
      start: fechaInicio,
      end: fechaFin,
      color,
    });

    // Resetear y cerrar modal
    setTitulo("");
    setDescripcion("");
    setFechaInicio("");
    setFechaFin("");
    setColor("#2563eb");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
        <h2 className="text-2xl font-bold mb-4 text-red-700">Crear Evento</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="p-2 border rounded-md"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="p-2 border rounded-md w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 border rounded"
              />
              <span className="text-sm text-gray-600">{color}</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-700"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-700 hover:bg-red-500 text-white"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
