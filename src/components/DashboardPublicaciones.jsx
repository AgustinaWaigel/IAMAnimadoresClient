import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Heart, HeartIcon, Search, Trash2, User } from "lucide-react";
import { startOfWeek, endOfWeek, format } from "date-fns";

export default function DashboardPublicaciones() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [mostrarSoloMias, setMostrarSoloMias] = useState(false);

  const cargarPosts = async () => {
    try {
      const res = await fetch(api("/muro"), {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
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
  };

  useEffect(() => {
    if (user) cargarPosts();
  }, [user]);

  const topPosts = [...posts]
    .filter((p) => p.likes > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  const conteoUsuarios = posts.reduce((acc, post) => {
    const username = post.autor?.username || "Desconocido";
    acc[username] = (acc[username] || 0) + 1;
    return acc;
  }, {});

  const usuariosActivos = Object.entries(conteoUsuarios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const postsFiltrados = posts.filter((p) => {
    const coincideTexto =
      p.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.autor?.username?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro
      ? p.categoria === categoriaFiltro
      : true;
    const esMio = mostrarSoloMias ? p.autor?._id === user?._id : true;
    return coincideTexto && coincideCategoria && esMio;
  });

  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("oracion");
  const [tipoArchivo, setTipoArchivo] = useState("texto");
  const [modalPost, setModalPost] = useState(null);
  const [archivo, setArchivo] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-2/3">
        <button
          onClick={() => setMostrarFormulario((prev) => !prev)}
          className="mb-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold shadow w-full text-center"
        >
          {mostrarFormulario ? "Cancelar publicación" : "Nueva publicación"}
        </button>

        {mostrarFormulario && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!contenido.trim())
                return alert("Escribí algo para publicar.");
              const formData = new FormData();
              formData.append("contenido", contenido);
              formData.append("categoria", categoria);
              formData.append("tipoArchivo", tipoArchivo);
              if (archivo) {
                for (let i = 0; i < archivo.length; i++) {
                  formData.append("archivo", archivo[i]);
                }
              }

              try {
                const res = await fetch(api("/muro"), {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${user.token}`,
                  },
                  body: formData,
                });

                const data = await res.json();
                if (data.success) {
                  setPosts((prev) => [
                    {
                      ...data.post,
                      likedByUser: false,
                      likes: 0,
                    },
                    ...prev,
                  ]);
                  setContenido("");
                  setCategoria("oracion");
                  setTipoArchivo("texto");
                  setArchivo(null);
                  setMostrarFormulario(false);
                } else {
                  alert("Error al publicar: " + data.message);
                }
              } catch (err) {
                console.error("Error al publicar:", err);
              }
            }}
            className="mb-8 space-y-4 border-b pb-6"
          >
            <textarea
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-400"
              placeholder="¿Qué estás pensando?"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              required
            />
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full md:w-1/2 border px-3 py-2 rounded-md"
              >
                <option value="oracion">Oración</option>
                <option value="reflexion">Reflexión</option>
                <option value="otro">Otro</option>
              </select>
              <select
                value={tipoArchivo}
                onChange={(e) => setTipoArchivo(e.target.value)}
                className="w-full md:w-1/2 border px-3 py-2 rounded-md"
              >
                <option value="texto">Solo texto</option>
                <option value="imagen">Imagen</option>
                <option value="pdf">PDF</option>
                <option value="documento">Documento</option>
              </select>
            </div>
            {tipoArchivo !== "texto" && (
              <input
                type="file"
                multiple
                onChange={(e) => setArchivo(e.target.files)}
                className="block w-full text-sm text-gray-500"
                accept={
                  tipoArchivo === "imagen"
                    ? ".jpg,.jpeg,.png,.gif,.webp"
                    : tipoArchivo === "pdf"
                    ? ".pdf"
                    : tipoArchivo === "documento"
                    ? ".doc,.docx"
                    : "*"
                }
              />
            )}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold shadow"
            >
              Publicar
            </button>
          </form>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Publicaciones
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-gray-300 px-10 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="w-full md:w-1/3 border border-gray-300 px-3 py-2 rounded-md focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="oracion">Oración</option>
              <option value="reflexion">Reflexión</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={mostrarSoloMias}
              onChange={() => setMostrarSoloMias(!mostrarSoloMias)}
              className="rounded border-gray-300"
            />
            Ver solo mis publicaciones
          </label>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando publicaciones...</p>
        ) : postsFiltrados.length === 0 ? (
          <p className="text-center text-gray-700">
            No hay publicaciones que coincidan.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {postsFiltrados.map((post) => (
              <li key={post._id} className="py-4">
                <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                  <User size={14} /> {post.autor?.username || "Anónimo"}
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-red-500 font-medium uppercase">
                    {post.categoria}
                  </span>
                </div>
                <p className="text-base text-gray-900 mb-2 whitespace-pre-wrap">
                  {post.contenido}
                </p>

                {post.tipoArchivo !== "texto" && post.archivoUrl && (
                  <div className="my-2">
                    {Array.isArray(post.archivoUrl) ? (
                      post.archivoUrl.map((url, idx) =>
                        post.tipoArchivo === "imagen" ? (
                          <img
                            key={idx}
                            src={url}
                            alt={`Imagen ${idx + 1}`}
                            className="rounded-lg object-contain w-full mb-2 max-h-[500px]"
                          />
                        ) : (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
                          >
                            Ver archivo {idx + 1}
                          </a>
                        )
                      )
                    ) : post.tipoArchivo === "imagen" ? (
                      <img
                        src={post.archivoUrl}
                        alt="Imagen subida"
                        className="rounded-lg max-h-80 object-cover w-full mb-2"
                      />
                    ) : (
                      <a
                        href={post.archivoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline block"
                      >
                        Ver archivo
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(api(`/muro/${post._id}/like`), {
                          method: "PATCH",
                          headers: {
                            Authorization: `Bearer ${user.token}`,
                            "Content-Type": "application/json",
                          },
                        });
                        const data = await res.json();
                        if (data.success) {
                          setPosts((prev) =>
                            prev.map((p) =>
                              p._id === post._id
                                ? {
                                    ...p,
                                    likedByUser: !p.likedByUser,
                                    likes: p.likedByUser
                                      ? p.likes - 1
                                      : p.likes + 1,
                                  }
                                : p
                            )
                          );
                        }
                      } catch (err) {
                        console.error("Error al dar like:", err);
                      }
                    }}
                    className={`flex items-center gap-1 ${
                      post.likedByUser ? "text-red-600" : "hover:text-red-600"
                    }`}
                  >
                    {post.likedByUser ? (
                      <HeartIcon fill="currentColor" size={18} />
                    ) : (
                      <Heart size={18} />
                    )}
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "¿Seguro que querés eliminar esta publicación?"
                        )
                      )
                        return;
                      try {
                        const res = await fetch(api(`/muro/${post._id}`), {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${user.token}`,
                          },
                        });
                        const data = await res.json();
                        if (data.success) {
                          setPosts((prev) =>
                            prev.filter((p) => p._id !== post._id)
                          );
                        } else {
                          alert("Error al eliminar: " + data.message);
                        }
                      } catch (err) {
                        console.error("Error al eliminar publicación:", err);
                      }
                    }}
                    className="hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="w-full lg:w-1/3 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Más likeadas
          </h2>
          {topPosts.length === 0 ? (
            <p className="text-sm text-gray-500">
              Todavía no hay publicaciones populares.
            </p>
          ) : (
            <ul className="space-y-3">
              {topPosts.map((post) => (
                <li
                  key={post._id}
                  onClick={() => setModalPost(post)}
                  className="text-sm text-gray-800 border-b pb-2 cursor-pointer hover:bg-gray-100 transition rounded-md px-2 py-1"
                >
                  <p className="line-clamp-2">{post.contenido}</p>
                  <span className="text-xs text-gray-500">
                    {post.likes} Me gusta
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Animadores más activos
          </h2>
          {usuariosActivos.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aún no hay usuarios con publicaciones.
            </p>
          ) : (
            <ul className="space-y-2">
              {usuariosActivos.map(([usuario, cantidad]) => (
                <li
                  key={usuario}
                  className="flex justify-between text-sm text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <User size={14} /> {usuario}
                  </span>
                  <span className="text-gray-500">{cantidad}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
      {modalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setModalPost(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2 text-red-600">
              {modalPost.categoria}
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              Publicado por {modalPost.autor?.username || "Anónimo"}
            </p>
            <p className="text-gray-800 whitespace-pre-wrap mb-4">
              {modalPost.contenido}
            </p>

            {modalPost.archivoUrl && modalPost.tipoArchivo === "imagen" && (
              <div className="space-y-2">
                {(Array.isArray(modalPost.archivoUrl)
                  ? modalPost.archivoUrl
                  : [modalPost.archivoUrl]
                ).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="rounded-lg max-h-[400px] w-full object-contain"
                  />
                ))}
              </div>
            )}

            {modalPost.archivoUrl &&
              modalPost.tipoArchivo !== "texto" &&
              modalPost.tipoArchivo !== "imagen" && (
                <div className="space-y-1">
                  {(Array.isArray(modalPost.archivoUrl)
                    ? modalPost.archivoUrl
                    : [modalPost.archivoUrl]
                  ).map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Archivo {i + 1}
                    </a>
                  ))}
                </div>
              )}

            {/* Botón de like dentro del modal */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-4">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(
                      api(`/muro/${modalPost._id}/like`),
                      {
                        method: "PATCH",
                        headers: {
                          Authorization: `Bearer ${user.token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );
                    const data = await res.json();
                    if (data.success) {
                      setPosts((prev) =>
                        prev.map((p) =>
                          p._id === modalPost._id
                            ? {
                                ...p,
                                likedByUser: !p.likedByUser,
                                likes: p.likedByUser
                                  ? p.likes - 1
                                  : p.likes + 1,
                              }
                            : p
                        )
                      );
                      setModalPost((prev) =>
                        prev
                          ? {
                              ...prev,
                              likedByUser: !prev.likedByUser,
                              likes: prev.likedByUser
                                ? prev.likes - 1
                                : prev.likes + 1,
                            }
                          : null
                      );
                    }
                  } catch (err) {
                    console.error("Error al dar like desde el modal:", err);
                  }
                }}
                className={`flex items-center gap-1 ${
                  modalPost.likedByUser ? "text-red-600" : "hover:text-red-600"
                }`}
              >
                {modalPost.likedByUser ? (
                  <HeartIcon fill="currentColor" size={18} />
                ) : (
                  <Heart size={18} />
                )}
                <span>{modalPost.likes}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
