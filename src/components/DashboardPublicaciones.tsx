import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Heart, HeartIcon, Search, Trash2, User, Plus, X, Image as ImageIcon, FileText, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Loader from "./Loader";

export default function DashboardPublicaciones() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [mostrarSoloMias, setMostrarSoloMias] = useState(false);

  // Formulario
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("oracion");
  const [tipoArchivo, setTipoArchivo] = useState("texto");
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [modalPost, setModalPost] = useState(null);

  const cargarPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(api("/muro"), {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setPosts(
          data.posts.map((post) => ({
            ...post,
            likedByUser: post.likedBy?.includes(user?._id),
            likes: post.likedBy?.length || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    cargarPosts();
  }, [cargarPosts]);

  // Lógica de Like Optimista
  const handleLike = async (postId) => {
    if (!user) return alert("Debes iniciar sesión");

    // Actualización local inmediata (Optimista)
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likedByUser: !p.likedByUser,
              likes: p.likedByUser ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );

    try {
      const res = await fetch(api(`/muro/${postId}/like`), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.success) throw new Error();
    } catch (err) {
      // Si falla, revertimos el cambio localmente
      cargarPosts();
    }
  };

  const handleEliminar = async (postId) => {
    if (!window.confirm("¿Seguro que querés eliminar esta publicación?")) return;
    try {
      const res = await fetch(api(`/muro/${postId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contenido.trim()) return;

    const formData = new FormData();
    formData.append("contenido", contenido);
    formData.append("categoria", categoria);
    formData.append("tipoArchivo", tipoArchivo);
    if (archivos) {
      Array.from(archivos).forEach((file) => formData.append("archivo", file));
    }

    try {
      const res = await fetch(api("/muro"), {
        method: "POST",
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => [{ ...data.post, likedByUser: false, likes: 0 }, ...prev]);
        setContenido("");
        setArchivos(null);
        setMostrarFormulario(false);
      }
    } catch (err) {
      alert("Error al publicar");
    }
  };

  const postsFiltrados = posts.filter((p) => {
    const matchBusqueda = 
      p.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.autor?.username?.toLowerCase().includes(busqueda.toLowerCase());
    const matchCat = categoriaFiltro ? p.categoria === categoriaFiltro : true;
    const matchMio = mostrarSoloMias ? p.autor?._id === user?._id : true;
    return matchBusqueda && matchCat && matchMio;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* COLUMNA PRINCIPAL */}
        <main className="w-full lg:w-2/3">
          {/* Header & Botón New Post */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Muro de Comunidad</h1>
            {user && (
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all shadow-sm ${
                  mostrarFormulario ? "bg-gray-200 text-gray-700" : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {mostrarFormulario ? <X size={20}/> : <Plus size={20}/>}
                {mostrarFormulario ? "Cerrar" : "Publicar"}
              </button>
            )}
          </div>

          {/* Formulario Animado */}
          <AnimatePresence>
            {mostrarFormulario && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8 overflow-hidden"
              >
                <textarea
                  className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-400 text-gray-800 resize-none"
                  rows={3}
                  placeholder={`¿Qué hay de nuevo, ${user?.username}?`}
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <select 
                    value={categoria} 
                    onChange={(e) => setCategoria(e.target.value)}
                    className="text-sm border-gray-200 rounded-lg"
                  >
                    <option value="oracion">🙏 Oración</option>
                    <option value="reflexion">💡 Reflexión</option>
                    <option value="otro">✨ Otro</option>
                  </select>
                  <select 
                    value={tipoArchivo} 
                    onChange={(e) => setTipoArchivo(e.target.value)}
                    className="text-sm border-gray-200 rounded-lg"
                  >
                    <option value="texto">Texto solo</option>
                    <option value="imagen">Imagen</option>
                    <option value="pdf">Archivo PDF</option>
                  </select>
                  {tipoArchivo !== "texto" && (
                    <label className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 rounded-lg text-xs font-semibold transition">
                      <ImageIcon size={16} /> Subir
                      <input type="file" hidden onChange={(e) => setArchivos(e.target.files)} />
                    </label>
                  )}
                </div>
                <button type="submit" className="w-full mt-4 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
                  Lanzar publicación
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Filtros Modernos */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por contenido o autor..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-400"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <select 
              value={categoriaFiltro} 
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-400"
            >
              <option value="">Todas las categorías</option>
              <option value="oracion">Oración</option>
              <option value="reflexion">Reflexión</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={mostrarSoloMias}
                onChange={() => setMostrarSoloMias(!mostrarSoloMias)}
                className="rounded text-red-600 focus:ring-red-500"
              />
              Mías
            </label>
          </div>

          {/* Lista de Posts */}
          {loading ? <Loader /> : (
            <div className="space-y-4">
              {postsFiltrados.map((post) => (
                <motion.div
                  layout
                  key={post._id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-none">{post.autor?.username}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                          <Clock size={10} />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full uppercase">
                      {post.categoria}
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                    {post.contenido}
                  </p>

                  {/* Galería Simple */}
                  {post.archivoUrl && (
                    <div className="mb-4 rounded-xl overflow-hidden border border-gray-100">
                      {Array.isArray(post.archivoUrl) ? (
                        <div className="grid grid-cols-1 gap-2">
                          {post.archivoUrl.map((url, i) => (
                            post.tipoArchivo === "imagen" 
                              ? <img key={i} src={url} alt="post" className="w-full object-cover max-h-96" />
                              : <a key={i} href={url} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 flex items-center gap-2 text-blue-600 text-sm"><FileText size={16}/> Ver archivo</a>
                          ))}
                        </div>
                      ) : (
                        post.tipoArchivo === "imagen" 
                          ? <img src={post.archivoUrl} alt="post" className="w-full object-cover max-h-96" />
                          : <a href={post.archivoUrl} target="_blank" rel="noreferrer" className="p-3 bg-gray-50 flex items-center gap-2 text-blue-600 text-sm"><FileText size={16}/> Ver archivo</a>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center gap-2 font-bold transition-colors ${
                        post.likedByUser ? "text-red-600" : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      {post.likedByUser ? <HeartIcon fill="currentColor" size={22} /> : <Heart size={22} />}
                      <span>{post.likes}</span>
                    </button>
                    {user?._id === post.autor?._id && (
                      <button onClick={() => handleEliminar(post._id)} className="text-gray-300 hover:text-red-600 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* ASIDE - Estadísticas */}
        <aside className="w-full lg:w-1/3 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <Heart size={20} className="text-red-500"/> Populares
            </h2>
            <div className="space-y-4">
              {posts.sort((a,b) => b.likes - a.likes).slice(0, 3).map(p => (
                <div key={p._id} className="group cursor-pointer" onClick={() => setModalPost(p)}>
                  <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-red-600 transition-colors italic">"{p.contenido}"</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-gray-400 uppercase">
                    <span>{p.autor?.username}</span>
                    <span>•</span>
                    <span className="text-red-500">{p.likes} likes</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl shadow-lg text-white">
            <h2 className="text-lg font-black mb-4">Líderes de Actividad</h2>
            <div className="space-y-3">
              {Object.entries(posts.reduce((acc: Record<string, number>, p) => {
                const username = p.autor?.username || "Anónimo";
                acc[username] = (acc[username] || 0) + 1;
                return acc;
              }, {})).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5).map(([name, count]) => (
                <div key={name} className="flex justify-between items-center bg-white/10 p-2 rounded-lg">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="bg-white text-red-600 px-2 py-0.5 rounded-full text-[10px] font-black">{Number(count)}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Modal de Detalle (opcional, simplificado) */}
      {modalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-xl w-full relative">
            <button onClick={() => setModalPost(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><X/></button>
            <span className="text-xs font-black text-red-500 uppercase tracking-widest">{modalPost.categoria}</span>
            <h3 className="text-xl font-bold mt-2 mb-4">Publicación de {modalPost.autor?.username}</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{modalPost.contenido}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}