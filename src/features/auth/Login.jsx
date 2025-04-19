import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // ✅ Corrección: no usar reload, solo detectar el query param
  const query = new URLSearchParams(location.search);
  const verificado = query.get("verificado") === "true";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(api("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        await login(data.token, rememberMe);
        navigate("/inicio");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
          Iniciar Sesión
        </h2>

        {/* ✅ Mostrar mensaje si vino el parámetro de verificado */}
        {verificado && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm text-center border border-green-400">
            ✅ Tu correo fue verificado con éxito. Ahora podés iniciar sesión.
          </div>
        )}

        <label>Nombre de usuario</label>
        <input
          type="text"
          value={username}
          autocomplete="username"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu usuario"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          autoComplete="current-password"
          className={`w-full px-4 py-2 mb-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="rememberMe" className="text-sm text-gray-700">
          Recordarme
        </label>
      </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black py-2 rounded-md hover:bg-green-600 hover:text-white transition-colors"
        >
          Ingresar
        </button>

        {error && (
          <p className="text-red-500 text-sm my-2 text-center">{error}</p>
        )}

        <p className="text-center text-sm mt-4 text-gray-600">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Registrate
          </Link>
        </p>

        <p className="text-center text-sm mt-2 text-gray-600">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/recuperar" className="text-blue-600 hover:underline">
            Recuperala
          </Link>
        </p>
      </form>
    </div>
  );
}
