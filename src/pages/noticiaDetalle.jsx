import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function NoticiaDetalle() {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleEliminar = async () => {
    const confirmar = window.confirm("¿Estás seguro que querés eliminar esta noticia?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/crear-noticia/${noticia._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("Noticia eliminada correctamente");
        navigate("/mostrar-noticias");
      } else {
        alert("Error al eliminar");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/crear-noticia/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró la noticia");
        return res.json();
      })
      .then(setNoticia)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-4 text-gray-600">Cargando noticia...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error.message}</p>;
  if (!noticia) return null;

  const bloques = Array.isArray(noticia.contenido)
    ? noticia.contenido
    : typeof noticia.contenido === "string"
      ? JSON.parse(noticia.contenido)
      : [];


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      {/* Encabezado */}
      <div className="space-y-1">
        <p className="uppercase text-sm text-gray-500 tracking-wide font-medium">
          {noticia.tipo || "Noticia"}
        </p>
        <h1 className="text-3xl font-bold text-red-700">{noticia.titulo}</h1>
        <p className="text-sm text-gray-600">
          {noticia.autor?.username || "Autor desconocido"} •{" "}
          {noticia.createdAt && !isNaN(new Date(noticia.createdAt))
            ? format(new Date(noticia.createdAt), "PPP", { locale: es })
            : "Fecha no disponible"}
        </p>
      </div>

      {/* Portada */}
      {noticia.portadaUrl && (
        <img
          src={noticia.portadaUrl}
          alt={`Portada de ${noticia.titulo}`}
          className="w-full h-auto rounded-lg shadow"
        />
      )}

      <div className="space-y-6">
        {bloques.map((bloque, i) => {
          if (bloque.tipo === "texto") {
            return (
              <div
                key={i}
                className="prose prose-sm sm:prose-base max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: bloque.contenido }}
              />
            );
          } else if (bloque.tipo === "imagen") {
            return (
              <img
                key={i}
                src={bloque.contenido}
                alt={`Imagen ${i + 1}`}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-contain rounded shadow my-4"
              />

            );
          }
          return null;
        })}
      </div>
      {user?.rol === "admin" && (
        <div className="pt-6 border-t border-gray-300 flex justify-end gap-3">
          <Link
            to={`/editar-noticia/${noticia._id}`}
            className="flex items-center gap-2 text-sm text-blue-600 border border-blue-300 px-3 py-1.5 rounded hover:bg-blue-50 transition"
          >
            ✏️ Editar
          </Link>

          <button
            onClick={() => {
              const confirmar = window.confirm("¿Estás seguro que querés eliminar esta noticia?");
              if (!confirmar) return;

              const segunda = window.confirm("⚠️ Esta acción no se puede deshacer. ¿Confirmás?");
              if (segunda) handleEliminar();
            }}
            className="flex items-center gap-2 text-sm text-red-600 border border-red-300 px-3 py-1.5 rounded hover:bg-red-50 transition"
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>


      )}



    </div>
  );
}
