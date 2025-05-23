import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CrearNoticiaBloques from "../components/CrearNoticiaBloques";
import { Plus } from "lucide-react";
import { Trash2 } from "lucide-react";


export default function MostrarNoticia() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const cargarNoticias = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/crear-noticia`);
      if (!res.ok) throw new Error("Error al cargar noticias");
      const data = await res.json();
      setNoticias(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleCreacionExitosa = () => {
    setMostrarFormulario(false);
    cargarNoticias();
  };

  return (
    <div className="p-6 space-y-6">
      {user?.rol === "admin" && (
        <div className="flex justify-center">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition text-sm"
          >
            <Plus size={18} /> {mostrarFormulario ? "Cerrar" : "Agregar noticia"}
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <div className="max-w-3xl mx-auto">
          <CrearNoticiaBloques onSuccess={handleCreacionExitosa} />

        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Cargando noticias...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error.message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((n) => (
            <Link
              to={`/mostrar-noticias/${n.slug}`}
              key={n._id}
              className="rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-all duration-200"
            >
              {n.portadaUrl && (
                <img
                  src={n.portadaUrl}
                  alt={`Portada de ${n.titulo}`}
                  className="w-full h-52 object-cover"
                />
              )}
              <div className="bg-gray-800 text-white p-3">
                <p className="text-xs text-gray-300 mb-1">
                  {n.autor?.username || "Autor desconocido"}
                </p>
                <h2 className="text-base font-semibold">{n.titulo}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
