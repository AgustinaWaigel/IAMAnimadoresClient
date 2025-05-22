import { useAuth } from "../context/AuthContext";

export default function ProbarNotificacion() {
  const { user } = useAuth();

  const enviarNotificacion = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/probar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Notificación enviada. Revisá si aparece.");
      } else {
        alert("❌ Falló el envío: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      alert("❌ Error de red al enviar notificación.");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={enviarNotificacion}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
      >
        Probar notificación push
      </button>
    </div>
  );
}
