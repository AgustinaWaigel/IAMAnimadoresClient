import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { Pencil, Trash2 } from "lucide-react";

export default function ModalNoticia({
  noticia,
  onClose,
  onDelete,
  user,
  onUpdate,
}) {
  if (!noticia) return null;

  const esImagen = noticia.archivoUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
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
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
        credentials: "include",
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-y-auto max-h-[90vh] relative p-6"
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-black text-xl">✕</button>

        {isEditing ? (
          <div className="space-y-4">
            <input
              value={nuevoTitulo}
              onChange={(e) => setNuevoTitulo(e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-lg"
              placeholder="Título"
            />
            <textarea
              value={nuevoContenido}
              onChange={(e) => setNuevoContenido(e.target.value)}
              className="w-full border px-3 py-2 rounded-md h-32 text-sm"
              placeholder="Contenido"
            />
            <input
              type="file"
              onChange={(e) => setArchivoNuevo(e.target.files[0])}
              className="text-sm"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md text-sm"
              >
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1.5 rounded-md text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{noticiaActual.titulo}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Publicado el {new Date(noticiaActual.createdAt).toLocaleDateString()}
            </p>

            {esImagen && (
              <img
                src={noticiaActual.archivoUrl}
                alt="Noticia"
                className="rounded-md w-full mb-4 max-h-[300px] object-cover"
              />
            )}

            {esPDF && (
              <a
                href={noticiaActual.archivoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm underline block mb-4 text-center"
              >
                📄 Ver documento PDF
              </a>
            )}

            {noticiaActual.contenido && (
              <p className="text-gray-700 text-sm mb-6">{noticiaActual.contenido}</p>
            )}

            {user?.rol === "admin" && (
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-600 hover:text-blue-600"
                  title="Editar"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => {
                    if (confirm("¿Eliminar esta noticia?")) onDelete(noticiaActual._id);
                  }}
                  className="text-gray-600 hover:text-red-600"
                  title="Eliminar"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
