import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ModalPublicacion({ post, onClose, onUpdate, onDelete }) {
  const { user } = useAuth();
  const [editando, setEditando] = useState(false);
  const [contenido, setContenido] = useState(post.contenido);
  const [categoria, setCategoria] = useState(post.categoria);
  const [archivo, setArchivo] = useState(null);

  const categorias = ['oracion', 'reflexion', 'imagen', 'archivo'];

  const handleUpdate = async () => {
    try {
      const res = await fetch(api(`/muro/${post._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ contenido }), // <<< ahora es JSON
      });
  
      const data = await res.json();
      if (data.success) {
        onUpdate(post._id, contenido);
        onClose();
      } else {
        alert('❌ No se pudo actualizar');
      }
    } catch (err) {
      console.error('❌ Error al actualizar publicación:', err);
    }
  };
  
  

  const handleDelete = async () => {
    if (confirm('¿Seguro que querés eliminar esta publicación?')) {
      await onDelete(post._id);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.8 }} 
          animate={{ scale: 1 }} 
          exit={{ scale: 0.8 }}
          className="bg-white p-6 rounded-3xl shadow-xl max-w-lg w-full relative space-y-4 overflow-y-auto max-h-[90vh]"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✖️</button>

          {editando ? (
            <div className="space-y-4">
              <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                className="w-full border p-3 rounded"
                rows="4"
              />
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full border p-2 rounded"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input type="file" onChange={(e) => setArchivo(e.target.files[0])} />

              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditando(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-yellow-500">{post.categoria.toUpperCase()}</h2>
              <p className="text-gray-800 whitespace-pre-wrap">{post.contenido}</p>

              {post.archivoUrl && post.tipoArchivo === 'image' && (
                <img
                  src={post.archivoUrl}
                  alt="Imagen subida"
                  className="rounded-lg w-full object-cover"
                />
              )}
              {post.archivoUrl && post.tipoArchivo === 'file' && (
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(post.archivoUrl)}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  📄 Ver archivo adjunto
                </a>
              )}

              <p className="text-sm text-gray-500">
                ✍️ {post.autor?.username || 'Anónimo'} — {new Date(post.createdAt).toLocaleDateString()}
              </p>

              {(user?._id === post.autor?._id || user?.rol === 'admin') && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setEditando(true)}
                    className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}