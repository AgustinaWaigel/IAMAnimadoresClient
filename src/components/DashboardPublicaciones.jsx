// src/pages/DashboardPublicaciones.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ModalPublicacion from "../components/ModalPublicacion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FileText, ImageIcon } from "lucide-react";

export default function DashboardPublicaciones() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("oracion");
  const [archivo, setArchivo] = useState(null);
  const [tipoArchivoForm, setTipoArchivoForm] = useState("texto");
  const [loading, setLoading] = useState(true);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [modalPost, setModalPost] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        const res = await fetch(api("/muro"));
        const data = await res.json();
        if (data.success) {
          setPosts(data.posts);
        } else {
          console.error("❌ Error al cargar publicaciones:", data.message);
        }
      } catch (err) {
        console.error("❌ Error de conexión:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return alert("Escribí algo para publicar");

    const formData = new FormData();
    formData.append("contenido", contenido);
    formData.append("categoria", categoria);
    formData.append("tipoArchivo", tipoArchivoForm);
    if (archivo) formData.append("archivo", archivo);

    try {
      const res = await fetch(api("/muro"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [data.post, ...prev]);
        setContenido("");
        setCategoria("oracion");
        setTipoArchivoForm("texto");
        setArchivo(null);
        setMostrarFormulario(false);
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error al publicar:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?"))
      return;
    try {
      const res = await fetch(api(`/muro/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          credentials: "include",
        },
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setModalPost(null);
      } else {
        alert("❌ No se pudo eliminar");
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  const handleUpdate = async (id, newContenido) => {
    if (!newContenido.trim()) return alert("El contenido no puede estar vacío");
    try {
      const res = await fetch(api(`/muro/${id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          credentials: "include",
        },
        body: JSON.stringify({ contenido: newContenido }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.map((p) => (p._id === id ? data.post : p)));
        setModalPost(null);
      } else {
        alert("❌ No se pudo actualizar");
      }
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
    }
  };

  const getFechasSemana = (offset) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dia = hoy.getDay();
    const inicio = new Date(hoy);
    inicio.setDate(inicio.getDate() - dia + offset * 7);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 7);
    return { inicio, fin };
  };

  const { inicio, fin } = getFechasSemana(semanaOffset);
  const publicacionesFiltradas = posts.filter((post) => {
    const fecha = new Date(post.createdAt);
    return fecha >= inicio && fecha < fin;
  });

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <motion.h1
        className="text-4xl font-bold text-yellow-400 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Publicaciones del Muro
      </motion.h1>

      {user && (
        <div className="text-center">
          <motion.button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className={`px-6 py-2 rounded-full font-semibold ${
              mostrarFormulario ? "bg-red-500" : "bg-blue-500"
            } text-white transition`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mostrarFormulario ? "❌ Cancelar" : "➕ Nueva publicación"}
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {mostrarFormulario && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 bg-white p-6 rounded-xl shadow-lg overflow-hidden"
          >
            {/* Texto de la publicación */}
            <textarea
              rows="3"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-300"
              placeholder="Escribí tu mensaje..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />

            {/* Categoría */}
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="oracion">Oración</option>
              <option value="reflexion">Reflexión</option>
              <option value="otro">Otro</option>
            </select>

            {/* Tipo de archivo */}
            <select
              value={tipoArchivoForm}
              onChange={(e) => setTipoArchivoForm(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="texto">Solo texto</option>
              <option value="imagen">Imagen (jpg, png, etc)</option>
              <option value="pdf">PDF</option>
              <option value="documento">Documento Word (.doc, .docx)</option>
            </select>

            {/* Input de archivo (solo si NO es texto) */}
            {tipoArchivoForm !== "texto" && (
              <input
                type="file"
                accept={
                  tipoArchivoForm === "imagen"
                    ? ".jpg,.jpeg,.png,.gif,.webp"
                    : tipoArchivoForm === "pdf"
                    ? ".pdf"
                    : tipoArchivoForm === "documento"
                    ? ".doc,.docx"
                    : "*"
                }
                onChange={(e) => setArchivo(e.target.files[0])}
                className="block w-full text-sm text-gray-500 mt-2"
              />
            )}

            {/* Botón Publicar */}
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded w-full transition"
            >
              Publicar
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center my-6">
        <button
          onClick={() => setSemanaOffset((prev) => prev - 1)}
          className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          <ArrowLeft size={20} /> Semana anterior
        </button>

        <button
          onClick={() => setSemanaOffset((prev) => prev + 1)}
          className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Semana siguiente <ArrowRight size={20} />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando publicaciones...</p>
      ) : publicacionesFiltradas.length === 0 ? (
        <p className="text-center text-gray-400">
          No hay publicaciones en esta semana.
        </p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {publicacionesFiltradas.map((post) => (
    <motion.li
      key={post._id}
      whileHover={{ scale: 1.02 }}
      onClick={() => setModalPost(post)}
      className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-md hover:shadow-2xl transition-all border border-gray-200 flex flex-col justify-between overflow-hidden"
    >
      {/* Imagen arriba (solo si es imagen) */}
      {post.tipoArchivo === "imagen" && post.archivoUrl && (
        <img
          src={post.archivoUrl}
          alt="Vista previa"
          className="w-full h-48 object-cover"
        />
      )}

      {/* Contenido principal */}
      <div className="flex flex-col flex-grow p-4 space-y-4">
        {/* Título (categoría) */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-blue-700 line-clamp-2">
            {post.categoria}
          </h3>

          <span
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
              post.tipoArchivo === "imagen"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {post.tipoArchivo === "imagen" ? (
              <>
                <ImageIcon size={14} /> Imagen
              </>
            ) : (
              <>
                <FileText size={14} /> Archivo
              </>
            )}
          </span>
        </div>

        {/* Contenido del post */}
        {post.contenido && (
          <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">
            {post.contenido}
          </p>
        )}

        {/* Botón para ver el archivo */}
        {post.archivoUrl && post.tipoArchivo !== "texto" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(post.archivoUrl, "_blank");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg p-2"
          >
            👁️ Ver {post.tipoArchivo === "imagen" ? "Imagen" : "Archivo"}
          </button>
        )}

        {/* Footer: fecha */}
        <div className="flex justify-between items-center text-xs text-gray-400 pt-4">
          <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.li>
  ))}
</ul>

      )}

      {modalPost && (
        <ModalPublicacion
          post={modalPost}
          onClose={() => setModalPost(null)}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          canEdit={user?._id === modalPost.autor?._id || user?.rol === "admin"}
        />
      )}
    </div>
  );
}
