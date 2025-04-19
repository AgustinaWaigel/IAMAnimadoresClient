import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";

export default function ModalNoticia({
  noticia,
  onClose,
  onDelete,
  user,
  onUpdate,
}) {
  if (!noticia) return null;

  const esImagen = noticia.archivoUrl?.match(/\.(jpg|jpeg|png|gif)$/i);
  const esPDF = noticia.archivoUrl?.match(/\.pdf$/i);

  const [isEditing, setIsEditing] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(noticia.titulo);
  const [nuevoContenido, setNuevoContenido] = useState(noticia.contenido || "");
  const [archivoNuevo, setArchivoNuevo] = useState(null);
  const [noticiaActual, setNoticiaActual] = useState(noticia);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("titulo", nuevoTitulo);
    formData.append("contenido", nuevoContenido);
    if (archivoNuevo) formData.append("archivo", archivoNuevo);

    try {
      const res = await fetch(api(`/noticias/${noticia._id}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setNoticiaActual(data.noticia);
        onUpdate();
        setIsEditing(false);
      } else {
        alert("❌ Error al actualizar");
      }
    } catch (err) {
      console.error("❌ Error al actualizar:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative p-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✖
        </button>

        {/* Edición */}
        {isEditing ? (
          <div className="space-y-6">
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-3 text-lg"
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
            />
            <textarea
              className="w-full border border-gray-300 rounded p-3 text-base h-32"
              value={nuevoContenido}
              onChange={(e) => setNuevoContenido(e.target.value)}
            />
            <input
              type="file"
              onChange={(e) => setArchivoNuevo(e.target.files[0])}
              className="text-sm"
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-yellow-400 mb-4 text-center">
              {noticiaActual.titulo}
            </h2>

            {esImagen && (
              <img
                src={noticiaActual.archivoUrl}
                alt="Noticia"
                className="rounded-xl w-full max-h-[400px] object-cover mb-6"
              />
            )}

            {esPDF && (
              <a
                href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                  noticiaActual.archivoUrl
                )}&embedded=true`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline text-center mb-6"
              >
                📄 Ver archivo PDF
              </a>
            )}

            {noticiaActual.contenido && (
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {noticiaActual.contenido}
              </p>
            )}

            <p className="text-sm text-gray-400 text-center mb-6">
              Publicado el {new Date(noticiaActual.createdAt).toLocaleDateString()}
            </p>

            {user?.rol === "admin" && (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("¿Eliminar esta noticia?"))
                      onDelete(noticiaActual._id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold"
                >
                  Eliminar
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
