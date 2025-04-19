import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ModalEvento({ evento, onClose, onDelete, isAdmin }) {
  if (!evento) return null;

  const formatoFecha = (fecha) =>
    format(new Date(fecha), "eeee d 'de' MMMM, HH:mm", { locale: es });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md relative animate-slideIn">
        <h2 className="text-2xl font-bold mb-4 text-yellow-500 text-center">
          {evento.title}
        </h2>

        <div className="mb-4">
          <p className="flex items-center text-gray-700 mb-2">
            Inicio 📅 <span className="ml-2">{formatoFecha(evento.start)}</span>
          </p>
          <p className="flex items-center text-gray-700 mb-2">
            Fin 🕒 <span className="ml-2">{formatoFecha(evento.end)}</span>
          </p>
          {evento.descripcion && (
            <p className="flex items-center text-gray-700">
              📝 <span className="ml-2">{evento.descripcion}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          {isAdmin && (
            <button
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Eliminar
            </button>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
