// ✅ Nuevo CarruselNoticias.jsx mejorado
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarruselNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const res = await fetch(api("/noticias"));
        const data = await res.json();
        setNoticias(data.filter((n) => n.tipo === "noticia"));
      } catch (err) {
        console.error("❌ Error al cargar noticias:", err);
      }
    };

    cargarNoticias();
  }, []);

  const siguiente = () => setIndice((prev) => (prev + 1) % noticias.length);
  const anterior = () =>
    setIndice((prev) => (prev - 1 + noticias.length) % noticias.length);

  if (noticias.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-gray-100 border border-slate-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={noticias[indice]._id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="w-auto h-72 flex flex-col items-center justify-center space-y-5 p-6"
        >
          {noticias[indice].archivoUrl &&
            noticias[indice].tipoArchivo === "imagen" && (
              <img
                src={noticias[indice].archivoUrl}
                alt="Noticia"
                className="h-40 rounded-lg object-cover shadow-md"
              />
            )}
          <h3 className="text-2xl font-bold text-gray-500 font-cute">
            {noticias[indice].titulo}
          </h3>
          {noticias[indice].contenido && (
            <p className="text-gray-500 text-sm line-clamp-3">
              {noticias[indice].contenido}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Botones navegación */}
      <button
        onClick={anterior}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full p-3 hover:bg-gray-100"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={siguiente}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full p-3 hover:bg-gray-100"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
