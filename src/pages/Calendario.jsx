import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import es from "date-fns/locale/es";
import CustomEvent from "../components/CustomEvent";
import CustomToolbar from "../components/CustomToolbar";
import ModalCrearEvento from "../components/ModalCrearEvento";
import ModalEvento from "../components/ModalEvento";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function Calendario() {
  const [eventos, setEventos] = useState([]);
  const { user } = useAuth();
  const [vistaActual, setVistaActual] = useState("month");
  const [fechaActual, setFechaActual] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrandoModal, setMostrandoModal] = useState(false);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const headers = user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {};

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/eventos`, {
          headers,
        });

        if (res.status === 401) {
          console.warn("Usuario no autorizado para ver eventos.");
          return;
        }

        const data = await res.json();
        setEventos(
          data.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))
        );
      } catch (err) {
        console.error("Error cargando eventos:", err);
      }
    };

    fetchEventos();
  }, [user?.token]);

  const handleCrearEvento = async (evento) => {
    if (!user?.token) {
      alert("⚠️ Debes iniciar sesión para crear eventos.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/eventos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
          credentials: 'include',
        },
        credentials: 'include',
        body: JSON.stringify(evento),
      });

      const data = await res.json();
      if (data.success) {
        setEventos((prev) => [
          ...prev,
          {
            ...data.evento,
            start: new Date(data.evento.start),
            end: new Date(data.evento.end),
          },
        ]);
        setMostrarModal(false);
      } else {
        alert("❌ No se pudo crear el evento.");
      }
    } catch (err) {
      console.error("Error creando evento:", err);
      alert("❌ Error de conexión.");
    }
  };

  const handleDeleteEvento = async () => {
    if (!user?.token) {
      alert("⚠️ Debes iniciar sesión para eliminar eventos.");
      return;
    }

    const confirmacion = window.confirm("¿Eliminar este evento?");
    if (!confirmacion) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/eventos/${eventoSeleccionado._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          credentials: 'include',
        }
      );

      const data = await res.json();
      if (data.success) {
        setEventos((prev) =>
          prev.filter((e) => e._id !== eventoSeleccionado._id)
        );
        setMostrandoModal(false);
      } else {
        alert("❌ No se pudo eliminar el evento.");
      }
    } catch (err) {
      console.error("Error eliminando evento:", err);
      alert("❌ Error de conexión.");
    }
  };

  return (
<div className="max-w-7xl mx-auto p-6">
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4 text-center md:text-left">
    <h1 className="text-3xl font-bold text-yellow-400 font-mifuentepersonalizada">
      Calendario
    </h1>

    {user?.rol === "admin" && (
      <button
        onClick={() => setMostrarModal(true)}
        className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-700 transition"
      >
        Crear evento
      </button>
    )}
  </div>

  {/* 👉 ENVOLVEMOS ACÁ */}
  <div className="overflow-x-auto">
    <Calendar
      className="rounded-lg bg-white shadow-lg p-4 min-w-[700px]"
      localizer={localizer}
      events={eventos}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 600 }}
      views={["month", "week", "day", "agenda"]}
      defaultView="month"
      view={vistaActual}
      onView={(vista) => setVistaActual(vista)}
      date={fechaActual}
      onNavigate={(fecha) => setFechaActual(fecha)}
      components={{
        event: CustomEvent,
        toolbar: (props) => (
          <CustomToolbar {...props} setVistaActual={setVistaActual} />
        ),
      }}
      onSelectEvent={(event) => {
        setEventoSeleccionado(event);
        setMostrandoModal(true);
      }}
      eventPropGetter={(event) => ({
        style: {
          backgroundColor: event.color || "#4f46e5",
          borderRadius: "8px",
          color: "#fff",
          border: `1px solid ${event.color || "#4f46e5"}`,
          padding: "4px",
          fontSize: "0.85rem",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      })}
    />
  </div>

  {mostrarModal && (
    <ModalCrearEvento onClose={() => setMostrarModal(false)} onCrear={handleCrearEvento} />
  )}

  {mostrandoModal && eventoSeleccionado && (
    <ModalEvento
      evento={eventoSeleccionado}
      isAdmin={user?.rol === "admin"}
      onClose={() => setMostrandoModal(false)}
      onDelete={handleDeleteEvento}
    />
  )}
</div>

  );
}
