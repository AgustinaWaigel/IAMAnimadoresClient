import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type EventoCalendario = {
  title: string;
  start: Date;
};

const descargarIcs = async (icsUrl: string): Promise<string> => {
  const candidatos = [
    icsUrl,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(icsUrl)}`,
    `https://r.jina.ai/http://${icsUrl.replace(/^https?:\/\//, "")}`,
  ];

  let ultimoError: unknown = null;
  for (const url of candidatos) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const texto = await res.text();
      if (texto.includes("BEGIN:VCALENDAR")) {
        return texto;
      }
      throw new Error("Contenido ICS inválido");
    } catch (error) {
      ultimoError = error;
    }
  }

  throw ultimoError || new Error("No se pudo descargar el calendario ICS");
};

const normalizarLineasIcs = (icsRaw: string): string[] => {
  const normalizado = icsRaw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lineas = normalizado.split("\n");
  const desplegadas: string[] = [];

  for (const linea of lineas) {
    if (/^[ \t]/.test(linea) && desplegadas.length > 0) {
      desplegadas[desplegadas.length - 1] += linea.trimStart();
    } else {
      desplegadas.push(linea);
    }
  }

  return desplegadas;
};

const obtenerCampoIcs = (lineas: string[], campo: string): string | null => {
  const linea = lineas.find(
    (l) => l.startsWith(`${campo}:`) || l.startsWith(`${campo};`)
  );
  if (!linea) return null;
  const indiceSeparador = linea.indexOf(":");
  return indiceSeparador >= 0 ? linea.slice(indiceSeparador + 1).trim() : null;
};

const parsearFechaIcs = (valor: string | null): Date | null => {
  if (!valor) return null;

  if (/^\d{8}$/.test(valor)) {
    const anio = Number(valor.slice(0, 4));
    const mes = Number(valor.slice(4, 6)) - 1;
    const dia = Number(valor.slice(6, 8));
    return new Date(anio, mes, dia, 0, 0, 0, 0);
  }

  if (/^\d{8}T\d{6}Z$/.test(valor)) {
    const anio = Number(valor.slice(0, 4));
    const mes = Number(valor.slice(4, 6)) - 1;
    const dia = Number(valor.slice(6, 8));
    const hora = Number(valor.slice(9, 11));
    const minuto = Number(valor.slice(11, 13));
    const segundo = Number(valor.slice(13, 15));
    return new Date(Date.UTC(anio, mes, dia, hora, minuto, segundo));
  }

  if (/^\d{8}T\d{6}$/.test(valor)) {
    const anio = Number(valor.slice(0, 4));
    const mes = Number(valor.slice(4, 6)) - 1;
    const dia = Number(valor.slice(6, 8));
    const hora = Number(valor.slice(9, 11));
    const minuto = Number(valor.slice(11, 13));
    const segundo = Number(valor.slice(13, 15));
    return new Date(anio, mes, dia, hora, minuto, segundo);
  }

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const parsearEventosDesdeIcs = (icsRaw: string): EventoCalendario[] => {
  const lineas = normalizarLineasIcs(icsRaw);
  const contenido = lineas.join("\n");
  const bloques = contenido
    .split("BEGIN:VEVENT")
    .slice(1)
    .map((bloque) => bloque.split("END:VEVENT")[0]);

  const eventos: EventoCalendario[] = [];
  for (const bloque of bloques) {
    const lineasEvento = bloque.split("\n");
    const titulo = obtenerCampoIcs(lineasEvento, "SUMMARY") || "Sin título";
    const inicioRaw = obtenerCampoIcs(lineasEvento, "DTSTART");
    const inicio = parsearFechaIcs(inicioRaw);

    if (inicio) {
      eventos.push({ title: titulo, start: inicio });
    }
  }

  return eventos;
};

const Inicio = () => {
  const [eventos, setEventos] = useState<EventoCalendario[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const googleCalendarIcsUrl = import.meta.env.VITE_GOOGLE_CALENDAR_ICS_URL;
        const googleCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;

        const icsUrl = googleCalendarIcsUrl
          ? googleCalendarIcsUrl
          : googleCalendarId
            ? `https://calendar.google.com/calendar/ical/${encodeURIComponent(googleCalendarId)}/public/basic.ics`
            : null;

        if (!icsUrl) {
          throw new Error("No hay configuración de Google Calendar para cargar eventos");
        }

        const icsRaw = await descargarIcs(icsUrl);
        const data = parsearEventosDesdeIcs(icsRaw);

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const proximos = data
          .filter((e) => e.start >= hoy)
          .sort((a, b) => a.start.getTime() - b.start.getTime())
          .slice(0, 10);

        setEventos(proximos);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    fetchEventos();
  }, []);

  // Agrupar eventos por mes
  const eventosAgrupados = eventos.reduce((acc: Record<string, EventoCalendario[]>, evento) => {
    const fecha = new Date(evento.start);
    const key = fecha.toLocaleString("es-AR", { month: "long", year: "numeric" });

    if (!acc[key]) acc[key] = [];
    acc[key].push(evento);
    return acc;
  }, {});

  return (
    <div className="pb-10 flex flex-col items-center text-center px-6 bg-gradient-to-b from-white to-yellow-100">
      <div className="bg-gradient-to-b from-amber-100 to-slate-10 h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
        
        <motion.h1
          className="text-4xl md:text-6xl font-cute text-red-700 mb-6 text-center px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          "Unidos en cristo, unidos en la mision"
        </motion.h1>

        <motion.img
          src="/RECURSOS IAM (1).png"
          alt="Niña misionera"
          className="w-72 md:w-96"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
      {/* Sección de Telegram */}
        {/*<div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-yellow-300">
          <h2 className="text-2xl font-bold mb-4 text-red-600">📣 ¡Unite al grupo de Telegram!</h2>
          <p className="text-gray-700 mb-4">
            Recibí notificaciones de nuevas noticias y eventos directamente en tu celular.
          </p>
          <a
            href="https://t.me/+yoll6FgPBwg4ZGVh"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            Unirme al grupo
          </a>
        </div>*/}


      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-400 px-10 py-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Infancia y Adolescencia Misionera
      </motion.h1>

      <motion.p
        className="text-lg md:text-2xl text-gray-700 max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Te acompañamos en tu misión de animar, organizar y compartir recursos
        para crecer en comunidad. 💡✨
      </motion.p>

      <motion.div
        className="w-full max-w-6xl px-4 py-12 flex flex-col md:flex-row gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >

        {/* Sección de próximos eventos agrupados */}
        <Link to="/calendario" className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-yellow-300 hover:shadow-2xl transition cursor-pointer">
          <h2 className="text-2xl font-bold mb-4 text-yellow-500">📅 Próximos eventos</h2>
          {eventos.length === 0 ? (
            <p className="text-gray-600">No hay eventos próximos.</p>
          ) : (
            Object.entries(eventosAgrupados).map(([mes, lista], i) => (
              <div key={i} className="mb-4 text-left">
                <h3 className="text-lg font-bold text-yellow-600 mb-2">🗓️ {mes.charAt(0).toUpperCase() + mes.slice(1)}</h3>
                <ul className="space-y-1 text-gray-700">
                  {(lista as any[]).map((evento, j) => {
                    const fecha = new Date(evento.start);
                    const dia = fecha.toLocaleDateString("es-AR", { day: "numeric", month: "numeric" });
                    const hora = fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
                    return (
                      <li key={j}>
                        🔸 <strong>{evento.title}</strong> — {dia}, {hora}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </Link>
      </motion.div>

      <motion.img
        src="imagenabrazo (1).webp"
        alt="Bienvenida"
        className="md:w-80 mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />

      <motion.div
        className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link
          to="/dashboard"
          className="bg-red-600 hover:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-lg transition"
        >
          Ir al muro de publicaciones
        </Link>

        <Link
          to="/informacion"
          className="bg-white border border-red-400 hover:bg-red-50 text-red-500 font-semibold py-3 px-6 rounded-lg text-lg shadow-lg transition"
        >
          Conocer más sobre la IAM
        </Link>
      </motion.div>

      <motion.p
        className="italic text-gray-500 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        "Todo lo que hagas, hazlo con amor." 💖
      </motion.p>
    </div>
  );
};

export default Inicio;
