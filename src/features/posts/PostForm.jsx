import { useState } from "react";

export default function PostForm({ setPosts }) {
  const [content, setContent] = useState("");

  const crearPost = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content }),
      });
  
      const data = await res.json();
      if (data.success) {
        // limpiar textarea, actualizar lista, etc.
        setContent('');
        alert('Post creado ✅');
        setPosts((prev) => [data.post, ...prev]);

      } else {
        alert('❌ Error al crear post');
      }
    } catch (err) {
      console.error('Error al crear post:', err);
      alert('❌ Error al conectar con el servidor');
    }
  };
  

  return (
    <form onSubmit={crearPost}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded mb-4"
        placeholder="Escribí tu post..."
      />

      <button
        type="submit"
        className="mt-2 bg-yellow-400 text-black py-2 px-4 rounded hover:bg-blue-700"
      >
        Publicar
      </button>
    </form>
  );
}
