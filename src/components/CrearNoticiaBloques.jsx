import { useState } from "react";
import axios from "axios";
import Editor from "../components/EditorBloque";
import { UploadCloud, Camera, Trash2, PlusCircle, FileText, Image as ImageIcon } from "lucide-react";

export default function CrearNoticiaBloques({ onSuccess }) {
    const [titulo, setTitulo] = useState("");
    const [portada, setPortada] = useState(null);
    const [bloques, setBloques] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const agregarBloque = (tipo) => {
        setBloques([...bloques, { tipo, contenido: tipo === "imagen" ? null : "" }]);
    };

    const actualizarBloque = (index, nuevoContenido) => {
        const nuevos = [...bloques];
        nuevos[index].contenido = nuevoContenido;
        setBloques(nuevos);
    };

    const eliminarBloque = (index) => {
        const nuevos = bloques.filter((_, i) => i !== index);
        setBloques(nuevos);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titulo.trim()) {
            setError("El título es obligatorio");
            return;
        }

        if (!bloques.length) {
            setError("La noticia debe tener al menos un bloque de contenido");
            return;
        }

        const bloquesFiltrados = bloques.filter(
            (bloque) => bloque.tipo !== "imagen" || bloque.contenido instanceof File
        );

        if (!bloquesFiltrados.length) {
            setError("El contenido está vacío");
            return;
        }

        const data = new FormData();
        data.append("titulo", titulo);
        if (portada) data.append("portada", portada);
        data.append("contenido", JSON.stringify(bloquesFiltrados));

        bloquesFiltrados.forEach((bloque) => {
            if (bloque.tipo === "imagen" && bloque.contenido instanceof File) {
                data.append("imagenes", bloque.contenido);
            }
        });

        console.log("🔍 ENVIANDO:", {
            titulo,
            portada,
            bloques: bloquesFiltrados,
            imagenesSubidas: bloquesFiltrados
                .filter((b) => b.tipo === "imagen" && b.contenido instanceof File)
                .map((f) => f.contenido.name),
        });

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/crear-noticia`, data);
            setMensaje("✅ Noticia subida correctamente");
            setError("");
            setTitulo("");
            setPortada(null);
            setBloques([]);
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error completo:", err);
            if (err.response?.data?.error) {
                setError("❌ " + err.response.data.error);
            } else {
                setError("❌ Error desconocido al subir la noticia");
            }
            setMensaje("");
        }
    };


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">Crear nueva noticia</h1>

            {mensaje && <div className="text-green-600 mb-2">{mensaje}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título de la noticia"
                    className="p-2 border rounded w-full"
                    required
                />

                <div className="flex flex-col gap-2">
                    <label className="flex gap-1 text-sm font-medium text-red-700"> <Camera size={18} /> Imagen de portada</label>
                    <input
                        type="file"
                        onChange={(e) => setPortada(e.target.files[0])}
                        accept="image/*"
                        className="p-2 border rounded w-full"
                    />
                    {portada && (
                        <div className="flex items-center justify-between border rounded p-2 bg-gray-50">
                            <p className="text-sm text-gray-600 truncate">{portada.name}</p>
                            <button
                                type="button"
                                onClick={() => setPortada(null)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Quitar portada
                            </button>
                        </div>
                    )}
                </div>


                <div className="flex flex-col gap-4">
                    {bloques.map((bloque, i) => (
                        <div key={i} className="relative border p-4 rounded bg-gray-50">
                            <button
                                type="button"
                                onClick={() => eliminarBloque(i)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                title="Eliminar bloque"
                            >
                                <Trash2 size={18} />
                            </button>


                            {bloque.tipo === "texto" ? (
                                <Editor
                                    contenido={bloque.contenido}
                                    onChange={(html) => actualizarBloque(i, html)}
                                />
                            ) : (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => actualizarBloque(i, e.target.files[0])}
                                    className="w-full"
                                />
                            )}
                        </div>
                    ))}

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={() => agregarBloque("texto")}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition text-sm"
                        >
                            <FileText size={18} /> Agregar texto
                        </button>

                        <button
                            type="button"
                            onClick={() => agregarBloque("imagen")}
                            className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition text-sm"
                        >
                            <ImageIcon size={18} /> Agregar imagen
                        </button>
                    </div>


                </div>

                <div className="flex justify-center mt-4">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800 transition"
                    >
                        <UploadCloud size={18} /> Subir noticia
                    </button>
                </div>

            </form>
        </div>
    );
}
