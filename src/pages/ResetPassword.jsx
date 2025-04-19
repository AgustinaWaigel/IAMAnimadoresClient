import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (nuevaPassword !== confirmPassword) {
      return setMensaje("❌ Las contraseñas no coinciden");
    }

    try {
      const res = await fetch(api(`/auth/reset-password/${token}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevaPassword }),
      });

      const data = await res.json();
      if (data.success) {
        setMensaje("✅ Contraseña actualizada, ahora podés iniciar sesión");
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setMensaje("❌ " + data.message);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setMensaje("Error al restablecer la contraseña");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🔒 Nueva contraseña</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <label className="text-sm block">
          <input
            type="checkbox"
            checked={mostrarPassword}
            onChange={() => setMostrarPassword(!mostrarPassword)}
            className="mr-2"
          />
          Mostrar contraseña
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Cambiar contraseña
        </button>
      </form>

      {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
}
