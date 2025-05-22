import { useState } from "react";
import axios from "axios";

export default function CrearNoticia() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [portada, setPortada] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !contenido || !portada) {
      setError("Faltan campos obligatorios");
      return;
    }

    const data = new FormData();
    data.append("titulo", titulo);
    data.append("contenido", contenido);
    data.append("portada", portada);
    imagenes.forEach((img) => data.append("imagenes", img));

    try {
      await axios.post("http://localhost:3001/api/crear-noticia", data);
      setMensaje("Noticia subida correctamente");
      setError("");
      setTitulo("");
      setContenido("");
      setPortada(null);
      setImagenes([]);
    } catch (err) {
      setError("Error al subir la noticia");
      setMensaje("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear nueva noticia</h1>

      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="p-2 border rounded"
          required
        />

        <textarea
          placeholder="Contenido"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="p-2 border rounded min-h-[150px]"
          required
        />

        <label className="font-semibold">Portada</label>
        <input
          type="file"
          onChange={(e) => setPortada(e.target.files[0])}
          className="p-1 border rounded"
          accept="image/*"
          required
        />

        <label className="font-semibold">Otras imágenes</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImagenes([...e.target.files])}
          className="p-1 border rounded"
          accept="image/*"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Subir Noticia
        </button>
      </form>
    </div>
  );
}
