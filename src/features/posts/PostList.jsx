import { useEffect } from "react";

export default function PostList({ posts, setPosts }) {
  // 💥 Esta función va FUERA del useEffect
  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
  
    const confirm = window.confirm("¿Estás seguro que querés eliminar este post?");
    if (!confirm) return;
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // 👈 asegurate que tenga Bearer
        },
      });
  
      // ✅ Usá res.ok para validar que no sea error HTML
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        alert("Post eliminado ✅");
      } else {
        console.warn("❌ Error al eliminar:", data);
        alert(data.message || "No se pudo eliminar el post");
      }
    } catch (err) {
      console.error("Error al borrar post:", err);
      alert("❌ Error al conectar con el servidor");
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error("Error al cargar posts:", err);
        setPosts([]);
      });
  }, [setPosts]);

  if (!posts.length) {
    return (
      <p className="text-center text-gray-600 mt-4">
        No hay publicaciones aún.
      </p>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white p-4 rounded shadow-md border border-gray-200 relative"
        >
          <p className="text-gray-800">{post.content}</p>
          <div className="text-sm text-gray-500 mt-2">
            Publicado por <strong>{post.author?.email || "Desconocido"}</strong>{" "}
            el {new Date(post.createdAt).toLocaleDateString()}
          </div>

          <button
            onClick={() => handleDelete(post._id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="Eliminar post"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
