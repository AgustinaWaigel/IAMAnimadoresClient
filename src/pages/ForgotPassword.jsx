// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { api } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    try {
      const res = await fetch(api("/auth/forgot-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await res.json();
      setMensaje(data.message);
    } catch (err) {
      console.error("❌ Error al solicitar recuperación:", err);
      setMensaje("Error al enviar el correo");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔐 Recuperar contraseña</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Enviar instrucciones
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm text-gray-700">📩 {mensaje}</p>}
    </div>
  );
}


