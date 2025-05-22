import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Trash2, Eye, Upload } from "lucide-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const categorias = ["catequesis", "espiritualidad", "servicio", "comunion", "Otros recursos"];

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recursos/por-edad/${edad}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        const agrupados = {};
        for (const cat of categorias) {
          const porCategoria = data.filter((r) => r.categoria === cat);
          const porGrupo = porCategoria.reduce((acc, item) => {
            const grupo = item.grupoId || item._id;
            if (!acc[grupo]) acc[grupo] = [];
            acc[grupo].push(item);
            return acc;
          }, {});
          agrupados[cat] = porGrupo;
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
    if (!archivo || archivo.length === 0) return alert("📎 Seleccioná al menos un archivo");
    const formData = new FormData();
    for (let i = 0; i < archivo.length; i++) formData.append("archivo", archivo[i]);
    formData.append("edad", edad);
    formData.append("categoria", categoria);
    formData.append("objetivo", objetivo);
    formData.append("tipoArchivo", tipoArchivoForm);
    formData.append("grupoId", crypto.randomUUID());

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recursos/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.recursos)) {
        alert("✅ Recursos subidos");
        setObjetivo("");
        setArchivo([]);
        setFileKey(Date.now());
        setCategoria(categorias[0]);
        setTipoArchivoForm("pdf");
        setArchivos((prev) => {
          const nuevos = { ...prev };
          const nuevosPorGrupo = { ...nuevos[categoria] };
          for (const recurso of data.recursos) {
            const grupo = recurso.grupoId || recurso._id;
            if (!nuevosPorGrupo[grupo]) nuevosPorGrupo[grupo] = [];
            nuevosPorGrupo[grupo].push(recurso);
          }
          nuevos[categoria] = nuevosPorGrupo;
          return nuevos;
        });
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("❌ Error al subir");
      console.error(err);
    }
  };

  const handleDelete = async (id, categoria, grupoId) => {
    if (!window.confirm("¿Estás seguro que querés borrar este recurso?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recursos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setArchivos((prev) => {
          const copia = { ...prev };
          const grupos = { ...copia[categoria] };
          const recursos = grupos[grupoId]?.filter((r) => r._id !== id) || [];
          if (recursos.length === 0) {
            delete grupos[grupoId];
          } else {
            grupos[grupoId] = recursos;
          }
          copia[categoria] = grupos;
          return copia;
        });
        alert("✅ Recurso eliminado");
      } else alert("❌ No se pudo eliminar");
    } catch (err) {
      alert("❌ Error al conectar con el servidor");
    }
  };

  const abrirArchivo = (file) => file.url && window.open(file.url, "_blank");
  if (isLoading) return <Loader />;
  const noHayRecursos = !isLoading && Object.values(archivos).every((cat) => Object.keys(cat).length === 0);

  return (
    <div className="mx-auto p-6 space-y-10">
      <div className="mb-4">
  <button
    onClick={() => navigate(-1)}
    className="text-sm text-red-600 underline hover:text-red-800"
  >
    ← Volver a la página anterior
  </button>
</div>
      <h1 className="text-3xl font-bold text-red-700 capitalize">Recursos para {edad}</h1>
      {noHayRecursos && <p className="text-center text-gray-400">No hay recursos disponibles para esta edad.</p>}

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
        <input type="text" placeholder="🔍 Buscar en objetivo o nombre" className="w-full md:w-1/2 border p-2 rounded-md" onChange={(e) => setBusqueda(e.target.value)} />
        <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)} className="w-full md:w-1/3 border p-2 rounded-md">
          <option value="">Todas las categorías</option>
          {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Listado agrupado */}
      {categorias.filter((cat) => categoriaFiltro === "" || categoriaFiltro === cat).map((cat) => {
        const grupos = archivos[cat] || {};
        const gruposFiltrados = Object.entries(grupos).filter(([_, recursos]) =>
          recursos.some((file) =>
            file.objetivo?.toLowerCase().includes(busqueda.toLowerCase()) ||
            file.nombre?.toLowerCase().includes(busqueda.toLowerCase())
          )
        );
        if (gruposFiltrados.length === 0) return null;

        return (
          <div key={cat}>
            <h2 className="text-xl font-semibold text-red-700 capitalize mb-2">{cat}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {gruposFiltrados.map(([grupoId, recursos]) => {
                const objetivoComun = recursos[0]?.objetivo || "Sin objetivo";
                return (
                  <motion.div key={grupoId} whileHover={{ scale: 1.02 }} className="bg-gray-100 rounded-2xl shadow-lg border p-4 flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm text-red-700 font-semibold italic mb-2">🎯 {objetivoComun}</h3>
                      <ul className="space-y-2">
                        {recursos.map((file) => (
                          <li key={file._id} className="flex flex-col gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500">{decodeURIComponent(file.nombre)}</span>
                            <div className="flex gap-2 flex-wrap mt-1">
                              <button onClick={() => abrirArchivo(file)} className="bg-gray-400 text-white text-sm rounded p-2 flex items-center gap-1">
                                <Eye size={16} /> Ver {file.tipoArchivo === "imagen" ? "Imagen" : "Archivo"}
                              </button>
                              {user && (
                                <button onClick={() => handleDelete(file._id, cat, grupoId)} className="bg-red-100 text-red-600 text-xs rounded-lg py-1 px-2 hover:bg-red-200 flex items-center gap-1">
                                  <Trash2 size={16} /> Eliminar
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Formulario */}
      {!user ? <p className="text-center text-red-600 font-semibold mt-8">Iniciá sesión para subir recursos.</p> : (
        <>
          <hr className="my-8" />
          <div className="text-right">
            <button onClick={() => setMostrarFormulario(!mostrarFormulario)} className="bg-gray-400 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2">
              <Upload className="w-5 h-5" /> {mostrarFormulario ? "Cerrar formulario" : "Subir nuevo recurso"}
            </button>
          </div>

          {mostrarFormulario && (
            <form onSubmit={handleUpload} className="bg-gray-100 p-4 rounded shadow space-y-4 mt-4">
              <h3 className="text-lg font-semibold text-red-700">Subir nuevo recurso</h3>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full border rounded p-2">
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={tipoArchivoForm} onChange={(e) => setTipoArchivoForm(e.target.value)} className="w-full border rounded p-2">
                <option value="pdf">PDF</option>
                <option value="documento">Documento</option>
                <option value="imagen">Imagen</option>
                <option value="otro">Texto</option>
              </select>
              <input type="text" placeholder="🎯 Objetivo o descripción" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="w-full border rounded p-2" />
              <input key={fileKey} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp" multiple onChange={(e) => setArchivo(e.target.files)} className="w-full" />
              <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-yellow-700">Subir recurso</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
