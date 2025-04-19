import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const categorias = [
  "catequesis",
  "espiritualidad",
  "servicio",
  "comunion",
  "Otros recursos",
];

export default function RecursosEdad() {
  const { edad } = useParams();
  const [archivos, setArchivos] = useState({});
  const [categoria, setCategoria] = useState(categorias[0]);
  const [archivo, setArchivo] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 agregado
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const { user } = useAuth();
  const [fileKey, setFileKey] = useState(Date.now());

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/recursos/por-edad/${edad}`
        );

        if (!res.ok) throw new Error("No se pudieron obtener los recursos");

        const data = await res.json();

        const agrupados = {};
        for (const cat of categorias) {
          agrupados[cat] = data.filter((r) => r.categoria === cat);
        }

        setArchivos(agrupados);
      } catch (err) {
        console.error("❌ Error al cargar recursos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecursos();
  }, [edad]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo) return alert("📎 Seleccioná un archivo PDF");

    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("edad", edad);
    formData.append("categoria", categoria);
    formData.append("objetivo", objetivo);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recursos/upload-pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },

          body: formData,
          credentials: 'include', // 👈 muy importante para cookies
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("✅ PDF subido");
        setObjetivo("");
        setArchivo(null); // limpia el archivo
        setFileKey(Date.now()); // fuerza reset del input
        setCategoria(categorias[0]); // opcional: reiniciar a primer categoría si querés
        setArchivos((prev) => ({
          ...prev,
          [categoria]: [...(prev[categoria] || []), data.recurso],
        }));
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("❌ Error al subir");
      console.error(err);
    }
  };

  const handleDelete = async (id, categoria) => {
    const confirm = window.confirm("¿Estás seguro que querés borrar este PDF?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recursos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`, // 👈 Usamos user.token en vez de localStorage
          },
          credentials: 'include', // 👈 muy importante para cookies
        }
      );

      const data = await res.json();
      if (data.success) {
        setArchivos((prev) => ({
          ...prev,
          [categoria]: prev[categoria].filter((r) => r._id !== id),
        }));
        alert("✅ PDF eliminado");
      } else {
        alert("❌ No se pudo eliminar");
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("❌ Error al conectar con el servidor");
    }
  };

  // 👇 este bloque va antes del return
  if (isLoading) {
    return <p className="text-center text-gray-500">Cargando recursos...</p>;
  }

  return (
    <div className=" mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-yellow-400 capitalize">
        Recursos para {edad}
      </h1>

      {categorias.map(
        (cat) =>
          (archivos[cat] || []).length > 0 && (
            <div key={cat}>
              <h2 className="text-xl font-semibold text-yellow-400 capitalize mb-2">
                {cat}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {(archivos[cat] || []).map((file) => (
                  <div
                    key={file._id || file.nombre}
                    className="bg-white rounded-lg shadow p-4 flex justify-between items-start border border-gray-200"
                  >
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-800 break-words">
                        {file.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        🎯 <span className="italic">{file.objetivo}</span>
                      </p>
                      <a
                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(
                          file.url
                        )}&embedded=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1 block"
                      >
                        Ver PDF
                      </a>
                    </div>

                    {user && (
                      <button
                        onClick={() => handleDelete(file._id, cat)}
                        className="text-yellow-500 hover:text-yellow-700 ml-4 mt-1"
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
      )}

      <hr className="my-8" />
      {user && (
        <div className="text-right">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition"
          >
            {mostrarFormulario ? "Cerrar formulario" : "📤 Subir nuevo PFD"}
          </button>
        </div>
      )}

      {user && mostrarFormulario && (
        <form
          onSubmit={handleUpload}
          className="bg-gray-100 p-4 rounded shadow space-y-4"
        >
          <h3 className="text-lg font-semibold text-yellow-400">
            Subir nuevo ENCUENTRO
          </h3>

          <div>
            <label className="block mb-1">Categoría:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full border rounded p-2"
            >
              {categorias.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Objetivo o descripción:</label>
            <input
              type="text"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block mb-1">Archivo PDF:</label>
            <input
              key={fileKey}
              type="file"
              accept=".pdf"
              onChange={(e) => setArchivo(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Subir PDF
          </button>
        </form>
      )}
    </div>
  );
}
