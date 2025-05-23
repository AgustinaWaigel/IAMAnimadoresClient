import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usePush } from "../hooks/usePush";

export default function ProbarNotificacion() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "Probar notificación";
  }, []);

  const { solicitarPermiso } = usePush();

  const enviarNotificacion = async () => {
    const fcmToken = await solicitarPermiso();
    if (!fcmToken) return alert("❌ No se pudo obtener el token de notificación");

    // Guardar token en el backend
    await fetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/guardar-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ fcmToken }),
    });

    // Ahora sí, pedir que se envíe la notificación
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/probar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await res.json();
    if (data.ok) {
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
