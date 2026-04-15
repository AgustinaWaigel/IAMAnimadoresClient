import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import PostCard from "../components/PostCard";
import Insertar from "../components/Insertar";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import FloatingActionButton from "../components/FloatingActionButton";
import { Upload } from "lucide-react";

export default function Logistica() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const cargarPosts = async () => {
    try {
      const res = await fetch(api("/posts?area=logistica"));
  
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
  
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("❌ Error al cargar logistica:", err);
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
    <div className="mx-auto p-10 pb-28 space-y-8 bg-white shadow-lg min-h-screen flex flex-col">
      <button
        onClick={() => navigate("/areas")}
        className="text-red-600 hover:text-red-800 font-semibold text-sm mb-6 flex items-center gap-2"
      >
        Volver a Áreas
      </button>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="font-extrabold text-red-500 text-center drop-shadow-lg font-mifuentepersonalizada text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
      >
        Área de Logística
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
        <>
          <FloatingActionButton
            open={mostrarFormulario}
            onClick={() => setMostrarFormulario((prev) => !prev)}
            labelOpen="Subir recurso"
            labelClose="Cerrar formulario"
            colorClassName="bg-red-600 hover:bg-red-700"
            icon={<Upload size={18} />}
          />

          <AnimatePresence>
            {mostrarFormulario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Insertar area="logistica" onNuevoPost={handleNuevoPost} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
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
