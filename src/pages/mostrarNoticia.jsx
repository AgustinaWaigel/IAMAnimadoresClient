import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MostrarNoticia() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch("http://localhost:3001/api/crear-noticia")
    .then((res) => {
      if (!res.ok) throw new Error("Error al cargar noticias");
      return res.json();
    })
    .then(setNoticias)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);


  if (loading) return <p>Cargando noticias...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {noticias.map((n) => (
        <Link
          to={`/mostrar-noticias/${n.slug}`}
          key={n._id}
          className="shadow p-4 rounded hover:bg-gray-100 transition-all"
        >
          {n.portadaUrl && (
            <img
              src={n.portadaUrl}
              alt={`Portada de ${n.titulo}`}
              className="w-full h-48 object-cover mb-2 rounded"
            />
          )}
          <h2 className="text-lg font-bold">{n.titulo}</h2>
        </Link>
      ))}
    </div>
  );
}
