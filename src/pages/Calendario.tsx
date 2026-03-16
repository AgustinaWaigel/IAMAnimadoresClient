import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { es } from "date-fns/locale";
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
  const googleCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
  const googleCalendarTz =
    import.meta.env.VITE_GOOGLE_CALENDAR_TZ || "America/Argentina/Buenos_Aires";
  const googleCalendarIcsUrl = import.meta.env.VITE_GOOGLE_CALENDAR_ICS_URL;

  const [eventos, setEventos] = useState([]);
  const { user } = useAuth();
  const [vistaActual, setVistaActual] = useState<View>("month");
  const [fechaActual, setFechaActual] = useState(new Date());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrandoModal, setMostrandoModal] = useState(false);
  const [loading, setLoading] = useState(true);

  if (googleCalendarId) {
    const encodedCalendarId = encodeURIComponent(googleCalendarId);
    const embedUrl = `https://calendar.google.com/calendar/embed?src=${encodedCalendarId}&ctz=${encodeURIComponent(googleCalendarTz)}`;
    const addToGoogleUrl = `https://calendar.google.com/calendar/u/0/r?cid=${encodedCalendarId}`;
    const icsUrl =
      googleCalendarIcsUrl ||
      `https://calendar.google.com/calendar/ical/${encodedCalendarId}/public/basic.ics`;

    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h1 className="text-3xl text-red-700 font-mifuentepersonalizada">
            Calendario
          </h1>

          <div className="flex flex-wrap gap-2">
            <a
              href={addToGoogleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition"
            >
              Agregar a mi Google Calendar
            </a>
            <a
              href={icsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-red-300 text-red-700 px-4 py-2 rounded hover:bg-red-50 transition"
            >
              Exportar (.ics)
            </a>
          </div>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg border bg-white">
          <iframe
            src={embedUrl}
            title="Calendario Google IAM"
            className="w-full"
            style={{ minHeight: "75vh", border: 0 }}
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchEventos = async () => {
      setLoading(true); // <- al principio

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
      } finally {
        setLoading(false); // <- al final
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
          credentials: "include",
        },
        credentials: "include",
        body: JSON.stringify({
          ...evento,
          start: evento.start,
          end: evento.end,
        }),

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
          credentials: "include",
        }
      );

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          console.error("❌ Error al eliminar:", data?.detalle || "Desconocido");
          alert(`❌ No se pudo eliminar el evento.\n${data?.message || ""}`);
        } else {
          const htmlError = await res.text();
          console.error("❌ Respuesta inesperada:", htmlError);
          alert("❌ Error inesperado del servidor.");
        }
        return;
      }

      setEventos((prev) =>
        prev.filter((e) => e._id !== eventoSeleccionado._id)
      );
      setMostrandoModal(false);
    } catch (err) {
      console.error("Error eliminando evento:", err);
      alert("❌ Error de red o del servidor.");
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4 text-center md:text-left">
        <h1 className="text-3xl font text-red-700 font-mifuentepersonalizada">
          Calendario
        </h1>

        {user?.rol === "admin" && (
          <button
            onClick={() => setMostrarModal(true)}
            className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Crear evento
          </button>
        )}
      </div>

      {/* 🎯 Corregimos el contenedor */}
      <div className="w-full overflow-hidden">
        <Calendar
          culture="es"
          className="rounded-lg bg-white shadow-lg p-2 md:p-4 w-full"
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, width: "100%" }}
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          view={vistaActual}
          onView={(vista) => setVistaActual(vista)}
          date={fechaActual}
          onNavigate={(fecha) => setFechaActual(fecha)}
          components={{
            event: CustomEvent,
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                onView={props.onView}
                vistaActual={vistaActual} // ✅ Lo pasás
              />
            ),
          }}
          onSelectEvent={(event) => {
            setEventoSeleccionado(event);
            setMostrandoModal(true);
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color || "#4f46e5",
              borderRadius: "6px",
              color: "#fff",
              border: `1px solid ${event.color || "#4f46e5"}`,
              padding: "2px 4px",
              fontSize: "0.75rem",
              fontWeight: "500",
              whiteSpace: "normal",       // ✅ Permite salto de línea
              lineHeight: "1.1rem",       // ✅ Más compacto
              overflowWrap: "break-word", // ✅ Corta palabras si hace falta
            },
          })}

        />
        {!loading && eventos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No hay eventos por el momento.
          </p>
        )}
      </div>

      {/* Modales */}
      {mostrarModal && (
        <ModalCrearEvento
          onClose={() => setMostrarModal(false)}
          onCrear={handleCrearEvento}
        />
      )}

      {mostrandoModal && eventoSeleccionado && (
        <ModalEvento
          evento={eventoSeleccionado}
          isAdmin={user?.rol === "admin"}
          onClose={() => setMostrandoModal(false)}
          onDelete={handleDeleteEvento}
          onUpdate={(eventoActualizado) => {
            setEventos((prev) =>
              prev.map((ev) =>
                ev._id === eventoActualizado._id
                  ? eventoActualizado
                  : ev
              )
            );
          }}


        />

      )}
    </div>
  );
}
