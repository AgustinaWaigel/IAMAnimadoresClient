import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Trash2, FileText, ImageIcon, Upload, Eye } from "lucide-react";
import Loader from "../components/Loader";
import { v4 as uuidv4 } from "uuid"; // 👈 agregado

const categorias = [
  "catequesis",
  "espiritualidad",
  "servicio",
  "comunion",
  "Otros recursos",
];

export default function RecursosEdad() {
  const { edad } = useParams();
  const { user } = useAuth();
  const [archivos, setArchivos] = useState({});
  const [categoria, setCategoria] = useState(categorias[0]);
  const [archivo, setArchivo] = useState([]);
  const [objetivo, setObjetivo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now());
  const [tipoArchivoForm, setTipoArchivoForm] = useState("pdf");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/recursos/por-edad/${edad}`
        );

        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        const agrupados = {};
        for (const cat of categorias) {
          agrupados[cat] = data.filter((r) => r.categoria === cat);
        }

        setArchivos(agrupados);
      } catch (err) {
        console.error("❌ Error al cargar recursos:", err);
        setArchivos({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecursos();
  }, [edad]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo || archivo.length === 0) {
      return alert("📎 Seleccioná al menos un archivo");
    }

    const grupoId = uuidv4(); // 👈 generamos grupoId único

    const formData = new FormData();
    for (let i = 0; i < archivo.length; i++) {
      formData.append("archivo", archivo[i]);
    }

    formData.append("edad", edad);
    formData.append("categoria", categoria);
    formData.append("objetivo", objetivo);
    formData.append("tipoArchivo", tipoArchivoForm);
    formData.append("grupoId", grupoId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recursos/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("✅ Recursos subidos");
        setObjetivo("");
        setArchivo([]);
        setFileKey(Date.now());
        setCategoria(categorias[0]);
        setTipoArchivoForm("pdf");

        if (data.recursos && Array.isArray(data.recursos)) {
          setArchivos((prev) => ({
            ...prev,
            [categoria]: [...(prev[categoria] || []), ...data.recursos],
          }));
        }
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("❌ Error al subir");
      console.error(err);
    }
  };

  const handleDelete = async (id, categoria) => {
    const confirm = window.confirm(
      "¿Estás seguro que querés borrar este recurso?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recursos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        setArchivos((prev) => ({
          ...prev,
          [categoria]: prev[categoria].filter((r) => r._id !== id),
        }));
        alert("✅ Recurso eliminado");
      } else {
        alert("❌ No se pudo eliminar");
      }
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      alert("❌ Error al conectar con el servidor");
    }
  };

  const abrirArchivo = (file) => {
    if (!file.url) return;
    window.open(file.url, "_blank");
  };

  if (isLoading) return <Loader />;

  const noHayRecursos =
    !isLoading && Object.values(archivos).every((arr) => arr.length === 0);

  return (
    <div className="mx-auto p-6 space-y-10">
      <h1 className="text-3xl font-bold text-red-700 capitalize">
        Recursos para {edad}
      </h1>

      {noHayRecursos && (
        <p className="text-center text-gray-400">
          No hay recursos disponibles para esta edad.
        </p>
      )}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar en objetivo o nombre"
          className="w-full md:w-1/2 border p-2 rounded-md"
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="w-full md:w-1/3 border p-2 rounded-md"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Listado agrupado por grupoId */}
      {categorias
        .filter((cat) => categoriaFiltro === "" || categoriaFiltro === cat)
        .map((cat) => {
          const filtrados = (archivos[cat] || []).filter(
            (file) =>
              file.objetivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
              file.nombre?.toLowerCase().includes(busqueda.toLowerCase())
          );
          if (filtrados.length === 0) return null;

          const grupos = {};
          filtrados.forEach((f) => {
            const gid = f.grupoId || "sin-grupo";
            if (!grupos[gid]) grupos[gid] = [];
            grupos[gid].push(f);
          });

          return (
            <div key={cat} className="space-y-6">
              <h2 className="text-xl font-semibold text-red-700 capitalize mb-2">
                {cat}
              </h2>

              {Object.entries(grupos).map(([gid, recursos]) => (
                <div key={gid} className="grid gap-4 md:grid-cols-2">
                  {recursos.map((file) => (
                    <motion.div
                      key={file._id || file.nombre}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gray-100 rounded-2xl shadow-lg border hover:shadow-2xl transition-all flex flex-col justify-between"
                    >
                      {file.tipoArchivo === "imagen" && (
                        <img
                          src={file.url}
                          alt="Vista previa"
                          className="w-full object-cover"
                        />
                      )}
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-red-700 break-words line-clamp-2">
                              {decodeURIComponent(file.nombre)}
                            </h3>

                            <span
                              className={`text-xs flex items-center gap-1 px-2 py-1 rounded-full ${
                                file.tipoArchivo === "imagen"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {file.tipoArchivo === "imagen" ? (
                                <>
                                  <ImageIcon size={14} /> Imagen
                                </>
                              ) : (
                                <>
                                  <FileText size={14} /> Archivo
                                </>
                              )}
                            </span>
                          </div>
                          {file.objetivo && (
                            <p className="text-gray-600 text-xs italic">
                              🎯 {file.objetivo}
                            </p>
                          )}
                        </div>
                        <div className="mt-4 flex flex-col space-y-2">
                          <button
                            onClick={() => abrirArchivo(file)}
                            className="bg-gray-400 hover:bg-gray-500 text-white text-sm rounded-lg p-2 flex items-center justify-center gap-1"
                          >
                            <Eye className="w-5 h-5" /> Ver {file.tipoArchivo === "imagen" ? "Imagen" : "Archivo"}
                          </button>
                          {user && (
                            <button
                              onClick={() => handleDelete(file._id, cat)}
                              className="bg-red-100 text-red-600 text-xs rounded-lg py-1 mt-2 hover:bg-red-200 flex items-center justify-center gap-1"
                            >
                              <Trash2 size={16} /> Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}

      {/* Formulario de subida */}
      {!user ? (
        <p className="text-center text-red-600 font-semibold mt-8">
          Iniciá sesión para subir recursos.
        </p>
      ) : (
        <></> // dejás el formulario como ya lo tenías
      )}
    </div>
  );
}
