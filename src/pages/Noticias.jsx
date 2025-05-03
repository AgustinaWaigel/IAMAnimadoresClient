import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ModalNoticia from "../components/ModalNoticia";
import { FileText, ImageIcon, File, Text, Trash2 } from "lucide-react";
import Loader from "../components/Loader";

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
        className="text-5xl font-extrabold text-red-700 text-center"
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
                ? "bg-red-700 hover:bg-red-600 text-white"
                : "bg-red-700 hover:bg-red-500 text-white"
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

                <button className="bg-red-400 hover:bg-red-500 text-white px-6 py-2 rounded w-full transition">
                  Publicar
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          <SeccionNoticias
            titulo="Últimas Noticias 🗞️"
            noticias={noticiasFiltradas}
            setNoticiaSeleccionada={setNoticiaSeleccionada}
            user={user}
            onDelete={handleDelete} // 👈 AGREGÁ ESTA LÍNEA
          />
          <SeccionNoticias
            titulo="Recursos Disponibles 📚"
            noticias={recursosFiltrados}
            setNoticiaSeleccionada={setNoticiaSeleccionada}
            user={user}
            onDelete={handleDelete} // 👈 TAMBIÉN ACÁ
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

function SeccionNoticias({ titulo, noticias, setNoticiaSeleccionada, onDelete, user }) {
  if (noticias.length === 0) return null;

  return (
    <motion.section
      className="space-y-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-extrabold text-red-700">{titulo}</h2>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {noticias.map((noti) => (
          <NoticiaCard
            key={noti._id}
            noticia={noti}
            onClick={() => setNoticiaSeleccionada(noti)}
            onDelete={onDelete}
            user={user}
          />
        ))}
      </div>
    </motion.section>
  );
}

function NoticiaCard({ noticia, onClick, onDelete, user }) {
  const esImagen = noticia.tipoArchivo === "imagen";
  const esArchivo =
    noticia.tipoArchivo === "pdf" || noticia.tipoArchivo === "documento";
  const esTexto = noticia.tipoArchivo === "texto";

  return (
    <motion.div
  onClick={onClick}
  whileHover={{ scale: 1.01 }}
  className="break-inside-avoid rounded-xl bg-white border border-gray-200 shadow-sm p-5 hover:shadow-md transition cursor-pointer flex flex-col"
>
  {/* Imagen destacada */}
  {esImagen && noticia.archivoUrl && (
    <img
      src={noticia.archivoUrl}
      alt="Imagen de la noticia"
      className="w-full h-48 object-cover rounded-md mb-4"
    />
  )}

  {/* Título y fecha */}
  <h3 className="text-xl font-semibold text-gray-800 mb-1">{noticia.titulo}</h3>
  <p className="text-xs text-gray-500 mb-2">
    Publicado el {new Date(noticia.createdAt).toLocaleDateString()}
  </p>

  {/* Contenido breve */}
  {noticia.contenido && (
    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{noticia.contenido}</p>
  )}

  {/* Botón ver archivo si es necesario */}
  {esArchivo && noticia.archivoUrl && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        window.open(noticia.archivoUrl, "_blank");
      }}
      className="self-start text-sm text-blue-600 font-medium hover:underline"
    >
      Ver documento
    </button>
  )}

  {/* Acciones admin */}
  {user?.rol === "admin" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (confirm("¿Estás seguro de que querés eliminar esta publicación?")) {
          onDelete(noticia._id);
        }
      }}
      className="mt-4 text-xs text-red-500 hover:underline self-start"
    >
      <Trash2 size={14} className="inline mr-1" />
      Eliminar
    </button>
  )}
</motion.div>

  );
}
