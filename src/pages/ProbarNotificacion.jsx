import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProbarNotificacion() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Probar notificación";
  }, []);

  const enviarNotificacion = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/probar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Notificación enviada con éxito");
    } else {
      alert("❌ Error al enviar notificación");
    }
  };

  if (!user) return <p className="text-center mt-10">Cargando usuario...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 space-y-4 text-center">
      <h1 className="text-3xl font-bold text-red-700">Probar Notificación Web</h1>
      <p className="text-gray-600">Tocá el botón para enviarte una notificación web push (si ya diste permiso).</p>

      <button
        onClick={enviarNotificacion}
        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition"
      >
        🔔 Enviarme una notificación
      </button>
    </div>
  );
}
