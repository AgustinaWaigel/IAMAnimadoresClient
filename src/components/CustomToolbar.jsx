// src/components/CustomToolbar.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomToolbar({ label, onNavigate, onView, vistaActual }) {
  const handleSelectChange = (e) => {
    const nuevaVista = e.target.value;
    onView(nuevaVista); // ✅ Notifica al calendario
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
      <div className="flex justify-center md:justify-start items-center gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          ◀
        </button>
        <span className="text-lg font-semibold">{label}</span>
        <button
          onClick={() => onNavigate("NEXT")}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
        >
          ▶
        </button>
      </div>

      <div className="flex justify-center md:justify-end">
        <select
          value={vistaActual} // ✅ Sincroniza la vista
          onChange={handleSelectChange}
          className="border p-2 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-red-400"
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
