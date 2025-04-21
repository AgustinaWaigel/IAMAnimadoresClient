import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ModalNoticia from "../components/ModalNoticia";
import { FileText, ImageIcon } from "lucide-react";
import CarruselNoticias from "../components/CarruselNoticias";

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
  const [tipoArchivoForm, setTipoArchivoForm] = useState("texto"); // 👈

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
    formData.append("tipoArchivo", tipoArchivoForm); // 👈 falta esto
    if (archivo) formData.append("archivo", archivo);

    try {
      const res = await fetch(api("/noticias"), {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
        credentials: "include",
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
        credentials: "include",
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

                <select
                  value={tipoArchivoForm}
                  onChange={(e) => setTipoArchivoForm(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value="texto">Solo texto</option>
                  <option value="imagen">Imagen (jpg, png, etc)</option>
                  <option value="pdf">PDF</option>
                  <option value="documento">
                    Documento Word (.doc, .docx)
                  </option>
                </select>

                {tipoArchivoForm !== "texto" && (
                  <input
                    type="file"
                    onChange={(e) => setArchivo(e.target.files[0])}
                    className="text-sm"
                    required
                  />
                )}

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
          <CarruselNoticias noticias={noticiasFiltradas} />
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
      <h2 className="text-4xl font-extrabold text-green-500">{titulo}</h2>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
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
  const esImagen = noticia.tipoArchivo === "imagen";
  const esArchivo =
    noticia.tipoArchivo === "pdf" || noticia.tipoArchivo === "documento";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      className="break-inside-avoid rounded-2xl bg-gray-100 border shadow-md p-4 flex flex-col space-y-4 hover:shadow-xl transition duration-300 cursor-pointer"
    >
      {/* Imagen arriba si es una imagen */}
      {esImagen && noticia.archivoUrl && (
        <img
          src={noticia.archivoUrl}
          alt="Vista previa"
          className="w-full h-48 object-cover"
        />
      )}

      {/* Contenido */}
      <div className="flex flex-col space-y-3 p-4">
        {/* Título */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-2xl text-gray-500">{noticia.titulo}</h3>

          {/* Tipo de archivo */}
          <span
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
              esImagen
                ? "bg-green-100 text-green-700"
                : esArchivo
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {esImagen ? (
              <>
                <ImageIcon size={14} /> Imagen
              </>
            ) : esArchivo ? (
              <>
                <FileText size={14} /> Archivo
              </>
            ) : null}
          </span>
        </div>

        {/* Contenido breve */}
        {noticia.contenido && (
          <p className="text-gray-600 text-base">{noticia.contenido}</p>
        )}

        {/* Si es archivo, mostrar botón */}
        {esArchivo && noticia.archivoUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(noticia.archivoUrl, "_blank");
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            📄 Ver Documento
          </button>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-400 mt-auto pt-2">
          Publicado el {new Date(noticia.createdAt).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}
