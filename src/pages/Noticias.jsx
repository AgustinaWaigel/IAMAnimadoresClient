import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ModalNoticia from "../components/ModalNoticia";

export default function Noticias() {
  const { user } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("noticia");
  const [archivo, setArchivo] = useState(null);
  const [contenido, setContenido] = useState("");
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  

  const cargarNoticias = async () => {
    try {
      const res = await fetch(api("/noticias"));
      const data = await res.json();
      setNoticias(data);
    } catch (err) {
      console.error("❌ Error al cargar noticias:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("tipo", tipo);
    formData.append("contenido", contenido);
    if (archivo) formData.append("archivo", archivo);

    try {
      const res = await fetch(api("/noticias"), {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setTitulo("");
        setArchivo(null);
        setContenido("");
        setMostrarFormulario(false);
        setNoticias((prev) => [data.noticia, ...prev]);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error al subir noticia:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(api(`/noticias/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNoticias((prev) => prev.filter((n) => n._id !== id));
      } else {
        alert("❌ Error al borrar: " + (data.message || "Error desconocido"));
      }
    } catch (err) {
      console.error("❌ Error al borrar noticia:", err);
    }
  };

  const noticiasFiltradas = noticias.filter((n) => n.tipo === "noticia");
  const recursosFiltrados = noticias.filter((n) => n.tipo === "recurso");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-16">
      <motion.h1
        className="text-5xl font-extrabold text-green-400 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Noticias y Recursos
      </motion.h1>

      {user?.rol === "admin" && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              mostrarFormulario
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-green-400 hover:bg-green-500 text-white"
            }`}
          >
            {mostrarFormulario ? "Cancelar" : "Subir Noticia o Recurso"}
          </motion.button>

          <AnimatePresence>
            {mostrarFormulario && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-lg rounded-xl p-6 mt-6 space-y-4"
              >
                <input
                  type="text"
                  placeholder="Título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
                <textarea
                  placeholder="Contenido breve (opcional)"
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  className="w-full border rounded p-2 h-24"
                />
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="noticia">Noticia</option>
                  <option value="recurso">Recurso</option>
                </select>
                <input
                  type="file"
                  onChange={(e) => setArchivo(e.target.files[0])}
                  className="text-sm"
                />
                <button className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded w-full transition">
                  Publicar
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Cargando...</p>
      ) : (
        <>
          <SeccionNoticias
            titulo="Últimas Noticias 🗞️"
            noticias={noticiasFiltradas}
            setNoticiaSeleccionada={setNoticiaSeleccionada}
          />
          <SeccionNoticias
            titulo="Recursos Disponibles 📚"
            noticias={recursosFiltrados}
            setNoticiaSeleccionada={setNoticiaSeleccionada}
          />
        </>
      )}

      {noticiaSeleccionada && (
        <ModalNoticia
          noticia={noticiaSeleccionada}
          onClose={() => setNoticiaSeleccionada(null)}
          onDelete={(id) => {
            handleDelete(id);
            setNoticiaSeleccionada(null);
          }}
          user={user}
          onUpdate={cargarNoticias}
        />
      )}
    </div>
  );
}

function SeccionNoticias({ titulo, noticias, setNoticiaSeleccionada }) {
  if (noticias.length === 0) return null;

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-blue-600">{titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {noticias.map((noti) => (
          <NoticiaCard
            key={noti._id}
            noticia={noti}
            onClick={() => setNoticiaSeleccionada(noti)}
          />
        ))}
      </div>
    </motion.section>
  );
}

function NoticiaCard({ noticia, onClick }) {
  const esImagen = noticia.archivoUrl?.match(/\.(jpg|jpeg|png|gif)$/i);
  const esPDF = noticia.archivoUrl?.match(/\.pdf$/i);
  const esLink = typeof noticia.contenido === "string" && noticia.contenido.startsWith("http");  
  
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition transform hover:scale-105 duration-300"
    >
      {esImagen && (
        <img
          src={noticia.archivoUrl}
          alt="Noticia"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4 space-y-2 flex flex-col flex-grow">
        <h3 className="font-bold text-yellow-500 text-lg">{noticia.titulo}</h3>

        {!esLink && noticia.contenido && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {noticia.contenido}
          </p>
        )}

        {esLink && (
          <a
            href={noticia.contenido}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // que no abra modal
            className="text-blue-600 hover:underline text-sm"
          >
            🔗 Ver enlace
          </a>
        )}

        {esPDF && (
          <span className="text-blue-600 text-xs">📄 Documento PDF</span>
        )}

        <p className="text-xs text-gray-400 mt-auto">
          Publicado el {new Date(noticia.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
