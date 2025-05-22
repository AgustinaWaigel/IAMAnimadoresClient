import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarDays,
  Clock,
  StickyNote,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import { useState } from "react";

export default function ModalEvento({ evento, onClose, onDelete, isAdmin, onUpdate}) {
  if (!evento) return null;

  // Ajuste horario local para inputs datetime-local
  const toLocalInput = (fecha) => {
    const d = new Date(fecha);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(evento.title || "");
  const [descripcion, setDescripcion] = useState(evento.descripcion || "");
  const [inicio, setInicio] = useState(toLocalInput(evento.start));
  const [fin, setFin] = useState(toLocalInput(evento.end));
  const [color, setColor] = useState(evento.color || "#2563eb");

  const formatoFecha = (fecha) =>
    format(new Date(fecha), "eeee d 'de' MMMM, HH:mm", { locale: es });

  const handleGuardar = async () => {
  if (!titulo || !inicio || !fin) {
    alert("Completá los campos requeridos.");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/eventos/${evento._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title: titulo,
        descripcion,
        start: new Date(inicio),
        end: new Date(fin),
        color,
      }),
    });

    const data = await res.json();
    if (data.success) {
      onUpdate?.({
        ...data.evento,
        start: new Date(data.evento.start),
        end: new Date(data.evento.end),
      });
      alert("✅ Evento actualizado.");
      onClose();
    } else {
      alert("❌ No se pudo actualizar.");
    }
  } catch (err) {
    console.error("Error actualizando evento:", err);
    alert("❌ Error al conectar con el servidor.");
  }
};


  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-700 text-center w-full">
            {editando ? "Editar evento" : evento.title}
          </h2>
        </div>

        {!editando ? (
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CalendarDays size={18} className="text-gray-500 mt-[2px]" />
              <span>{formatoFecha(evento.start)}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock size={18} className="text-gray-500 mt-[2px]" />
              <span>{formatoFecha(evento.end)}</span>
            </div>
            {evento.descripcion && (
              <div className="flex items-start gap-2">
                <StickyNote size={18} className="text-gray-500 mt-[2px]" />
                <span>{evento.descripcion}</span>
              </div>
            )}
            {isAdmin && (
              <button
                onClick={() => setEditando(true)}
                className="mt-4 text-sm px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <Pencil size={16} />
                Editar
              </button>
            )}
          </div>
        ) : (
          <form className="space-y-3 text-sm text-gray-700">
            <input
              type="text"
              className="w-full border rounded-md p-2"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
              required
            />
            <textarea
              className="w-full border rounded-md p-2"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción (opcional)"
            />
            <div>
              <label className="block text-xs font-medium mb-1">Inicio</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md p-2"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Fin</label>
              <input
                type="datetime-local"
                className="w-full border rounded-md p-2"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Seleccionar color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-10 h-10 border rounded"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <span className="text-sm text-gray-600">{color}</span>
              </div>
            </div>
          </form>
        )}

        <div className="flex justify-end gap-3 mt-6">
          {editando ? (
            <>
              <button
                onClick={handleGuardar}
                className="text-sm px-4 py-1.5 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Guardar cambios
              </button>
              <button
                onClick={() => setEditando(false)}
                className="text-sm px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              {isAdmin && (
                <button
                  onClick={onDelete}
                  className="text-sm px-4 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              )}
              <button
                onClick={onClose}
                className="text-sm px-4 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
