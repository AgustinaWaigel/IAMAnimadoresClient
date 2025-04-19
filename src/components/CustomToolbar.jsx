export default function CustomToolbar({ label, onNavigate, onView, setVistaActual }) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-2">
          <button onClick={() => onNavigate('TODAY')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Hoy</button>
          <button onClick={() => onNavigate('PREV')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">◀️</button>
          <button onClick={() => onNavigate('NEXT')} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">▶️</button>
        </div>
        <span className="text-lg font-semibold">{label}</span>
        <div className="flex gap-2">
          <button onClick={() => { onView('month'); setVistaActual('month'); }} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Mes</button>
          <button onClick={() => { onView('week'); setVistaActual('week'); }} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Semana</button>
          <button onClick={() => { onView('day'); setVistaActual('day'); }} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Día</button>
          <button onClick={() => { onView('agenda'); setVistaActual('agenda'); }} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Agenda</button>
        </div>
      </div>
    );
  }
  