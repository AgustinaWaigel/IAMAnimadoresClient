import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Clock, StickyNote, Trash2, X } from "lucide-react";

export default function ModalEvento({ evento, onClose, onDelete, isAdmin }) {
  if (!evento) return null;

  const formatoFecha = (fecha) =>
    format(new Date(fecha), "eeee d 'de' MMMM, HH:mm", { locale: es });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-red-700 text-center mb-4">
          {evento.title}
        </h2>

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
        </div>

        <div className="flex justify-end gap-3 mt-6">
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
        </div>
      </div>
    </div>
  );
}
