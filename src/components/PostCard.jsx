import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Trash2, FileText, ImageIcon, Eye, Calendar } from "lucide-react";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const { archivo: archivoUrl, tipoArchivo = "otro" } = post;

  const handleDeleteConfirm = () => {
    if (window.confirm("¿Seguro que querés eliminar este archivo? 🗑️")) {
      onDelete(post._id);
    }
  };

  const abrirArchivo = (url) => {
    if (!url) return;

    if (tipoArchivo === "imagen") {
      window.open(url, "_blank");
    } else {
      window.open(url, "_blank"); // Puede ser drive o gview directo
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border hover:shadow-2xl transition-all flex flex-col justify-between bg-gray-100"
    >
      {/* Vista previa SOLO para imagenes */}
      {tipoArchivo === "imagen" && (
        <img
          src={archivoUrl}
          alt="Vista previa"
          className="w-full object-cover"
        />
      )}

      {/* Contenido */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-red-700 line-clamp-2">
              {post.titulo || post.categoria}
            </h3>
            <span
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
                tipoArchivo === "imagen"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {tipoArchivo === "imagen" ? (
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

          {post.contenido && (
            <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">
              {post.contenido}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="mt-4 flex flex-col space-y-2">
          {archivoUrl && (
            <button
              onClick={() => abrirArchivo(archivoUrl)}
              className="bg-gray-300 hover:bg-gray-600 text-white font-semibold text-sm rounded-lg p-2 flex items-center justify-center gap-1"
            >
              <Eye className="w-5 h-5" />
              Ver {tipoArchivo === "imagen" ? "Imagen" : "Archivo"}
            </button>
          )}

          <p className="text-xs text-gray-400 text-center">
            <Calendar size={14} className="inline" />{" "}
            {new Date(post.fecha || post.createdAt).toLocaleDateString()}
          </p>

          {(user?.rol === "admin" || userId === post.autor?._id) && (
            <button
              onClick={handleDeleteConfirm}
              className="bg-red-100 text-red-600 text-xs rounded-lg py-1 mt-2 hover:bg-red-200 transition flex items-center justify-center gap-1"
            >
              <Trash2 size={16} /> Eliminar
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
