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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        // ... tu lógica de fetch ICS ...
        const googleCalendarId = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
        const icsUrl = `https://calendar.google.com/calendar/ical/${encodeURIComponent(googleCalendarId)}/public/basic.ics`;
        const icsRaw = await descargarIcs(icsUrl);
        const data = parsearEventosDesdeIcs(icsRaw);

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const proximos = data
          .filter((e) => e.start >= hoy)
          .sort((a, b) => a.start.getTime() - b.start.getTime())
          .slice(0, 4); // Reducimos a 4 para no saturar la home

        setEventos(proximos);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventos();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans text-slate-800 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-white px-6 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-red-100/40 rounded-full blur-3xl" />

        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.img
            src="/RECURSOS IAM (1).png"
            alt="Niña misionera"
            className="w-64 md:w-80 drop-shadow-2xl mb-8"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <h1 className="text-4xl md:text-7xl font-black text-red-700 text-center leading-tight tracking-tight max-w-4xl">
             <span className="text-yellow-500 block text-2xl md:text-3xl font-cute mb-2 italic">Unidos en Cristo,</span>
             "Unidos en la Misión"
          </h1>
        </motion.div>

        <motion.div 
          className="absolute bottom-10 animate-bounce cursor-pointer text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-sm uppercase tracking-widest font-bold">Desliza</span>
          <div className="w-[2px] h-10 bg-gray-200 mx-auto mt-2" />
        </motion.div>
      </section>

      {/* --- SECCIÓN CONTENIDO PRINCIPAL --- */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Columna Izquierda: Mensaje */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-slate-900 leading-snug">
              Infancia y <br/>
              <span className="text-yellow-500 underline decoration-red-500 underline-offset-8">Adolescencia Misionera</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Te acompañamos en tu misión de animar, organizar y compartir recursos 
              para que los niños y adolescentes crezcan en comunidad, llevando el 
              mensaje de Jesús a todas partes. 💡✨
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/dashboard"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-red-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-2"
              >
                📬 Muro de Noticias
              </Link>
              <Link
                to="/informacion"
                className="bg-white border-2 border-slate-200 hover:border-yellow-400 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all flex items-center gap-2"
              >
                📖 Saber más
              </Link>
            </div>
          </motion.div>

          {/* Columna Derecha: Calendario Estilizado */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-yellow-100 p-8 border border-yellow-100"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <span className="text-yellow-500 text-3xl">📅</span> Calendario
              </h3>
              <Link to="/calendario" className="text-red-500 font-bold text-sm hover:underline">Ver todo</Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-2xl"/>)}
              </div>
            ) : eventos.length === 0 ? (
              <p className="text-center py-10 text-gray-400 italic">No hay eventos próximos registrados.</p>
            ) : (
              <div className="space-y-4">
                {eventos.map((evento, idx) => {
                  const fecha = new Date(evento.start);
                  const dia = fecha.getDate();
                  const mes = fecha.toLocaleDateString("es-AR", { month: "short" }).replace(".", "");
                  
                  return (
                    <motion.div 
                      key={idx}
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-200"
                    >
                      <div className="bg-red-50 text-red-600 min-w-[60px] h-[60px] rounded-xl flex flex-col items-center justify-center font-bold">
                        <span className="text-xl leading-none">{dia}</span>
                        <span className="text-xs uppercase">{mes}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 leading-tight">{evento.title}</h4>
                        <p className="text-sm text-slate-500">
                          {fecha.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs
                        </p>
                      </div>
                      <div className="text-amber-300">❯</div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

        </div>

        {/* --- PIE DE PÁGINA / FRASE --- */}
        <motion.div 
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <img 
            src="/imagenabrazo (1).webp" 
            alt="Abrazo misionero" 
            className="w-48 mx-auto mb-8 grayscale hover:grayscale-0 transition-all duration-700 opacity-60 hover:opacity-100"
          />
          <p className="text-2xl md:text-3xl italic font-cute text-slate-400 max-w-2xl mx-auto leading-relaxed">
            "Todo lo que hagas, <span className="text-red-500 not-italic font-bold">hazlo con amor.</span>" 💖
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <div className="w-2 h-2 rounded-full bg-red-500"/>
             <div className="w-2 h-2 rounded-full bg-yellow-400"/>
             <div className="w-2 h-2 rounded-full bg-blue-500"/>
             <div className="w-2 h-2 rounded-full bg-green-500"/>
             <div className="w-2 h-2 rounded-full bg-white border border-gray-200"/>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default Inicio;