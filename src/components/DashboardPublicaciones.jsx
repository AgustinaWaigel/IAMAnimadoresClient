import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import ModalPublicacion from "../components/ModalPublicacion";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function DashboardPublicaciones() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("oracion");
  const [archivo, setArchivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [modalPost, setModalPost] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const categorias = ["oracion", "reflexion", "imagen", "archivo"];

  useEffect(() => {
    const cargarPosts = async () => {
      try {
        const res = await fetch(api("/muro"));
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("❌ Error al cargar publicaciones:", err);
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
    if (archivo) formData.append("archivo", archivo);

    try {
      const res = await fetch(api("/muro"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }
        ,
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setContenido("");
        setArchivo(null);
        setCategoria("oracion");
        setPosts((prev) => [data.post, ...prev]);
        setMostrarFormulario(false); // Ocultamos después de enviar
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error al publicar:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(api(`/muro/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }
        ,
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
    try {
      const res = await fetch(api(`/muro/${id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        }
        ,
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
      <motion.h1
        className=" text-gray-500 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
      Este espacio esta pensado para que puedas compartir tus pensamientos, reflexiones o cualquier cosa que quieras expresar.
      </motion.h1>

      {user && (
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              mostrarFormulario
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
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
            <textarea
              rows="3"
              className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-300"
              placeholder="Escribí tu mensaje..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded p-2"
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="block text-sm"
            />

            <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded w-full transition">
              Publicar
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setSemanaOffset((prev) => prev - 1)}
          className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          <ArrowLeft size={20} />
          Semana anterior
        </button>

        <p className="text-sm text-gray-600">
          {inicio.toLocaleDateString()} - {fin.toLocaleDateString()}
        </p>
        <button
          onClick={() => setSemanaOffset((prev) => prev + 1)}
          className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          disabled={semanaOffset === 0}
        >

          Semana siguiente 
          <ArrowRight size={20} />
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
              onClick={() => setModalPost(post)}
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
              }}
              className="bg-gradient-to-br from-white via-yellow-50 to-white p-6 rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col space-y-4"
            >
              <p className="text-gray-700 text-base font-medium whitespace-pre-wrap line-clamp-3 leading-relaxed">
                {post.contenido}
              </p>

              {post.archivoUrl && post.tipoArchivo === "image" && (
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={post.archivoUrl}
                    alt="Adjunto"
                    className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500 rounded-2xl"
                  />
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                <div className="flex items-center space-x-2">
                  <span>📁 {post.categoria}</span>
                  <span>✍️ {post.autor?.username || "Anónimo"}</span>
                </div>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
