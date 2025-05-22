import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NoticiaDetalle() {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/crear-noticia/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se encontró la noticia");
        return res.json();
      })
      .then(setNoticia)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-4">Cargando noticia...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error.message}</p>;
  if (!noticia) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {noticia.portadaUrl && (
        <img
          src={noticia.portadaUrl}
          alt={`Portada de ${noticia.titulo}`}
          className="w-full h-auto rounded-lg mb-4 shadow"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{noticia.titulo}</h1>
      <p className="text-gray-700 whitespace-pre-line mb-6">{noticia.contenido}</p>

      {noticia.imagenes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {noticia.imagenes.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Imagen ${i + 1}`}
              className="w-full h-auto rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
}
