import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import PostCard from "../components/PostCard";
import Insertar from "../components/Insertar";
import { useNavigate } from "react-router-dom";

export default function Espiritualidad() {
  const { user } = useAuth();
  const [comunicados, setComunicados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const navigate = useNavigate();

  const cargarComunicados = async () => {
    try {
      const res = await fetch(api("/posts?area=espiritualidad"));
      const data = await res.json();
      setComunicados(data);
    } catch (err) {
      console.error("❌ Error al cargar comunicados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarComunicados();
  }, []);

  const handleNuevoPost = (nuevoPost) => {
    setComunicados((prev) => [nuevoPost, ...prev]);
    setMostrarFormulario(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(api(`/posts/${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setComunicados((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
    }
  };

  return (
    <div className="py-10 h-screen bg-gradient-to-b from-slate-50 to-slate-100 max-w-6xl mx-auto p-6 space-y-8">
      <button
        onClick={() => navigate("/areas")}
        className="text-blue-600 hover:text-blue-800 font-semibold text-sm mb-6 flex items-center gap-2"
      >
        Volver a Áreas
      </button>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="font-mifuentepersonalizada text-7xl font-extrabold text-gray-400 text-center drop-shadow-lg"
      >
        Área de Espiritualidad
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-700 text-center text-lg max-w-2xl mx-auto"
      >
        Encontrá aquí los comunicados, imágenes y archivos importantes de la
        IAM. 📄✨
      </motion.p>

      {user?.rol === "admin" && (
        <div className="text-center space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarFormulario((prev) => !prev)}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              mostrarFormulario
                ? "bg-slate-100 hover:bg-slate-300 text-black"
                : "bg-slate-100 hover:bg-slate-300 text-black"
            }`}
          >
            {mostrarFormulario ? "Cancelar subida" : "Subir comunicado"}
          </motion.button>

          <AnimatePresence>
            {mostrarFormulario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Insertar area="espiritualidad" onNuevoPost={handleNuevoPost} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <hr className="border-gray-300" />

      <h2 className="text-2xl font-bold text-gray-800 text-center">
        📂 Archivos subidos
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : comunicados.length === 0 ? (
        <p className="text-center text-gray-400 mt-6">
          Todavía no hay comunicados. 📭
        </p>
      ) : (
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {comunicados.map((post) => (
            <motion.li
              key={post._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <PostCard post={post} onDelete={handleDelete} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
