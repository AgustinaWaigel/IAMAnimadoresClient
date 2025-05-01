import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Heart, HeartIcon } from "lucide-react";
import {
  startOfWeek,
  endOfWeek,
  format
} from "date-fns";

export default function DashboardPublicaciones() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("oracion");
  const [tipoArchivo, setTipoArchivo] = useState("texto");
  const [archivo, setArchivo] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [semanaActualIndex, setSemanaActualIndex] = useState(0);

  const cargarPosts = async () => {
    try {
      const res = await fetch(api("/muro"), {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(
          data.posts.map((post) => ({
            ...post,
            likedByUser: post.likedBy?.includes(user?._id),
            likes: post.likedBy?.length || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) cargarPosts();
  }, [user]);

  const handleLike = async (id) => {
    if (!user) return alert("Iniciá sesión para dar Me Gusta.");

    try {
      const res = await fetch(api(`/muro/${id}/like`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === id
              ? {
                  ...p,
                  likedByUser: !p.likedByUser,
                  likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Error al cambiar like:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?")) return;

    try {
      const res = await fetch(api(`/muro/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Error al eliminar: " + data.message);
      }
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return alert("Escribí algo para publicar.");

    const formData = new FormData();
    formData.append("contenido", contenido);
    formData.append("categoria", categoria);
    formData.append("tipoArchivo", tipoArchivo);
    if (archivo) {
      for (let i = 0; i < archivo.length; i++) {
        formData.append("archivo", archivo[i]);
      }
    }

    try {
      const res = await fetch(api("/muro"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [
          {
            ...data.post,
            likedByUser: false,
            likes: 0,
          },
          ...prev,
        ]);
        setContenido("");
        setCategoria("oracion");
        setTipoArchivo("texto");
        setArchivo(null);
        setMostrarFormulario(false);
      } else {
        alert("Error al publicar: " + data.message);
      }
    } catch (err) {
      console.error("Error al publicar:", err);
    }
  };

  const agruparPorSemana = (posts) => {
    const semanas = {};
    posts.forEach((post) => {
      const fecha = new Date(post.createdAt);
      const inicio = startOfWeek(fecha, { weekStartsOn: 1 });
      const fin = endOfWeek(fecha, { weekStartsOn: 1 });
      const clave = `${format(inicio, "dd/MM/yyyy")} - ${format(fin, "dd/MM/yyyy")}`;
      if (!semanas[clave]) semanas[clave] = [];
      semanas[clave].push(post);
    });
    return semanas;
  };

  const postsFiltrados = posts.filter((p) =>
    (p.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
     p.categoria.toLowerCase().includes(busqueda.toLowerCase())) &&
    (categoriaFiltro ? p.categoria === categoriaFiltro : true)
  );

  const publicacionesPorSemana = agruparPorSemana(postsFiltrados);
  const claves = Object.keys(publicacionesPorSemana).sort().reverse();
  const semanaActual = claves[semanaActualIndex] || claves[0];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <motion.h1
        className="text-2xl font-bold text-red-700 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Publicaciones
      </motion.h1>

      {user && (
        <div className="text-center mb-6">
          <motion.button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="px-6 py-2 rounded-full font-semibold bg-red-700 text-white transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {mostrarFormulario ? "Cancelar" : "Nueva Publicación"}
          </motion.button>
        </div>
      )}

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow-md flex flex-col gap-4 mb-8">
          <textarea
            rows="3"
            className="w-full p-3 border rounded focus:ring-2 focus:ring-red-300"
            placeholder="¿Qué estás pensando?"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full border rounded p-2" required>
            <option value="oracion">Oración</option>
            <option value="reflexion">Reflexión</option>
            <option value="otro">Otro</option>
          </select>
          <select value={tipoArchivo} onChange={(e) => setTipoArchivo(e.target.value)} className="w-full border rounded p-2" required>
            <option value="texto">Solo texto</option>
            <option value="imagen">Imagen</option>
            <option value="pdf">PDF</option>
            <option value="documento">Documento</option>
          </select>
          {tipoArchivo !== "texto" && (
            <input
              type="file"
              multiple
              onChange={(e) => setArchivo(e.target.files)}
              className="block w-full text-sm text-gray-500"
              accept={
                tipoArchivo === "imagen"
                  ? ".jpg,.jpeg,.png,.gif,.webp"
                  : tipoArchivo === "pdf"
                  ? ".pdf"
                  : tipoArchivo === "documento"
                  ? ".doc,.docx"
                  : "*"
              }
            />
          )}
          <button type="submit" className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded w-full transition">
            Publicar
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Buscar por contenido o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <select
        value={categoriaFiltro}
        onChange={(e) => setCategoriaFiltro(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-6"
      >
        <option value="">Todas las categorías</option>
        <option value="oracion">Oración</option>
        <option value="reflexion">Reflexión</option>
        <option value="otro">Otro</option>
      </select>

      {loading ? (
        <p className="text-center text-gray-500">Cargando publicaciones...</p>
      ) : claves.length === 0 ? (
        <p className="text-center text-gray-700">No hay publicaciones que coincidan.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSemanaActualIndex((prev) => Math.min(prev + 1, claves.length - 1))}
              disabled={semanaActualIndex >= claves.length - 1}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Semana anterior
            </button>
            <span className="font-semibold">{semanaActual}</span>
            <button
              onClick={() => setSemanaActualIndex((prev) => Math.max(prev - 1, 0))}
              disabled={semanaActualIndex <= 0}
              className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Semana siguiente
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {publicacionesPorSemana[semanaActual]?.map((post) => (
              <motion.div key={post._id} whileHover={{ backgroundColor: "#f8f8f8" }} className="border-b pb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-red-600 capitalize">{post.categoria}</h3>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{post.contenido}</p>
                  {Array.isArray(post.archivoUrl) && post.archivoUrl.length > 0 && post.tipoArchivo === "imagen" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                      {post.archivoUrl.map((url, idx) => (
                        <img key={idx} src={url} alt={`Imagen ${idx + 1}`} className="rounded-lg max-h-80 object-cover w-full" />
                      ))}
                    </div>
                  )}
                  {Array.isArray(post.archivoUrl) && post.archivoUrl.length > 0 && post.tipoArchivo !== "imagen" && (
                    <div className="flex flex-col gap-2 mt-2">
                      {post.archivoUrl.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Ver archivo {idx + 1}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-4 items-center pt-2 text-sm text-gray-600">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-1 ${post.likedByUser ? "text-red-600" : "hover:text-red-600"}`}
                    >
                      {post.likedByUser ? (
                        <HeartIcon fill="currentColor" size={18} />
                      ) : (
                        <Heart size={18} />
                      )}
                      <span>{post.likes}</span>
                    </button>
                    {(user?.rol === "admin" || user?._id === post.autor?._id) && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}