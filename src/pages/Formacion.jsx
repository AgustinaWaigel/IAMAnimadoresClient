import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import PostCard from "../components/PostCard";
import Insertar from "../components/Insertar";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

export default function Formacion() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const cargarPosts = async () => {
    try {
      const res = await fetch(api("/posts?area=formacion"));
  
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
  
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("❌ Error al cargar formacion:", err);
      setPosts([]); // importante para evitar que quede colgado
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    cargarPosts();
  }, []);

  const handleNuevoPost = (nuevoPost) => {
    setPosts((prev) => [nuevoPost, ...prev]);
    setMostrarFormulario(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(api(`/posts/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  return (
    <div className="min-h-screen mx-auto p-10 space-y-8 bg-white shadow-lg">
      <button
        onClick={() => navigate("/areas")}
        className="text-yellow-600 hover:text-yellow-800 font-semibold text-sm mb-6 flex items-center gap-2"
      >
        Volver a Áreas
      </button>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="font-extrabold text-yellow-400 text-center drop-shadow-lg font-mifuentepersonalizada text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Área de Formación
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 text-center text-lg max-w-2xl mx-auto"
      >
        Encontrá aquí los recursos, imágenes y archivos importantes de la IAM. 📄✨
      </motion.p>

      {user?.rol === "admin" && (
        <div className="text-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              mostrarFormulario
                ? "bg-yellow-400 hover:bg-yellow-600 text-white"
                : "bg-yellow-400 hover:bg-yellow-600 text-white"
            }`}
          >
            {mostrarFormulario ? "Cancelar subida" : "Subir recurso"}
          </motion.button>

          <AnimatePresence>
            {mostrarFormulario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Insertar area="formacion" onNuevoPost={handleNuevoPost} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <hr className="border-gray-300" />

      <h2 className="text-2xl font-bold text-gray-800 text-center">
        📂 Recursos subidos
      </h2>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">
          Todavía no hay recursos subidos. 📭
        </p>
      ) : (
        <motion.div
          className="columns-1 sm:columns-2 md:columns-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {posts.map((post) => (
            <div key={post._id} className="mb-4 break-inside-avoid">
              <PostCard post={post} onDelete={handleDelete} />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
