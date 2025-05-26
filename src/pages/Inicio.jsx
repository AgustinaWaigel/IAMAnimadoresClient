import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Inicio = () => {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/eventos`);
        const data = await res.json();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const proximos = data
          .filter(e => new Date(e.start) >= hoy)
          .sort((a, b) => new Date(a.start) - new Date(b.start))
          .slice(0, 10);

        setEventos(proximos);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    fetchEventos();
  }, []);

  // Agrupar eventos por mes
  const eventosAgrupados = eventos.reduce((acc, evento) => {
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
          "Misioneros de esperanza, entre los pueblos"
        </motion.h1>

        <motion.img
          src="/logo-año-diocesano.webp"
          alt="Niña misionera"
          className="w-72 md:w-96"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
      {/* Sección de Telegram */}
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 border border-yellow-300">
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
        </div>

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
                  {lista.map((evento, j) => {
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
