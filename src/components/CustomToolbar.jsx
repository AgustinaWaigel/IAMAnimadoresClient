import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomToolbar({ label, onNavigate, onView, vistaActual }) {
  const handleSelectChange = (e) => {
    onView(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      {/* Navegación de fechas */}
      <div className="flex justify-center md:justify-start items-center gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          aria-label="Anterior"
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-lg font-semibold">{label}</span>
        <button
          onClick={() => onNavigate("NEXT")}
          aria-label="Siguiente"
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Selector de vista */}
      <div className="flex justify-center md:justify-end">
        <select
          value={vistaActual}
          onChange={handleSelectChange}
          className="border border-gray-300 p-2 rounded-md bg-white text-sm focus:ring-2 focus:ring-red-400"
        >
          <option value="month">Mes</option>
          <option value="week">Semana</option>
          <option value="day">Día</option>
          <option value="agenda">Agenda</option>
        </select>
      </div>
    </div>
  );
}
