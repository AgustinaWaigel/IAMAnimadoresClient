import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Insertar({ isAdmin = false, area = "comunicacion", onNuevoPost }) {
  const { user } = useAuth();
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tipoArchivo, setTipoArchivo] = useState("imagen"); // nuevo tipo de archivo
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  if (isAdmin && user?.rol !== "admin") return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);
    setMensaje("");

    const form = new FormData();
    form.append("titulo", titulo);
    form.append("contenido", contenido);
    form.append("categoria", titulo);
    form.append("area", area);
    form.append("tipo", "general");
    form.append("tipoArchivo", tipoArchivo); // enviamos tipoArchivo al backend
    if (archivo) form.append("archivo", archivo);

    try {
      const res = await fetch(api("/posts"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        setTitulo("");
        setContenido("");
        setArchivo(null);
        setTipoArchivo("imagen");
        setMensaje("✅ Publicado correctamente");
        if (onNuevoPost) onNuevoPost(data.post);
      } else {
        setMensaje("❌ Error al publicar: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error al subir post:", err);
      setMensaje("❌ Error interno al subir el contenido.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-md border p-6 rounded-2xl shadow-xl flex flex-col gap-4 transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título o Categoría..."
        className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
        required
        whileFocus={{ scale: 1.02 }}
        disabled={subiendo}
      />

      <motion.textarea
        placeholder="Descripción (opcional)"
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-yellow-400 outline-none transition"
        whileFocus={{ scale: 1.02 }}
        disabled={subiendo}
      />

      <div>
        <label className="text-sm text-gray-600 block mb-1">Tipo de Archivo:</label>
        <select
          value={tipoArchivo}
          onChange={(e) => setTipoArchivo(e.target.value)}
          className="block w-full border border-gray-300 p-3 rounded-lg text-gray-700"
          disabled={subiendo}
        >
          <option value="imagen">Imagen</option>
          <option value="pdf">PDF</option>
          <option value="documento">Documento (Word)</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-1">Adjuntar Archivo (opcional)</label>
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          className="block w-full text-sm text-gray-500"
          disabled={subiendo}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        className={`${subiendo ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-400 hover:bg-yellow-500"} bg-yellow-300 text-white font-semibold py-2 rounded-lg shadow-md transition`}
        disabled={subiendo}
      >
        {subiendo ? "Publicando..." : "Publicar Contenido"}
      </motion.button>

      {mensaje && (
        <p className="text-center text-sm mt-2 text-gray-700">{mensaje}</p>
      )}
    </motion.form>
  );
}
