import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [usernameDisponible, setUsernameDisponible] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailDisponible, setEmailDisponible] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
    const checkEmail = async () => {
      if (!form.email.includes("@")) return setEmailDisponible(null);

      setCheckingEmail(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/check-email?email=${form.email}`
        );
        const data = await res.json();
        setEmailDisponible(data.disponible);
      } catch (err) {
        console.error(err);
        setEmailDisponible(null);
      } finally {
        setCheckingEmail(false);
      }
    };

    const delay = setTimeout(checkEmail, 500);
    return () => clearTimeout(delay);
  }, [form.email]);

  // Validación del username en tiempo real
  useEffect(() => {
    const checkUsername = async () => {
      if (form.username.trim().length < 3) return setUsernameDisponible(null);

      setCheckingUsername(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/check-username?username=${
            form.username
          }`
        );
        const data = await res.json();
        setUsernameDisponible(data.disponible);
      } catch (err) {
        console.error(err);
        setUsernameDisponible(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const delay = setTimeout(checkUsername, 500);
    return () => clearTimeout(delay);
  }, [form.username]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(form.password)) {
      alert(
        "❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número."
      );
      return;
    }

    if (form.password !== form.repeatPassword) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    if (usernameDisponible === false) {
      alert("❌ El nombre de usuario ya está en uso");
      return;
    }

    if (emailDisponible === false) {
      alert("❌ El correo electrónico ya está registrado");
      return;
    }
    

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        alert("✅ Registro exitoso. Revisá tu correo para confirmar tu cuenta.");
        navigate("/login"); // redirige al login sin loguear automáticamente
        return;
      } else {
        alert("❌ " + data.message);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-red-700">
          Crear Cuenta
        </h2>

        <label className="block mb-1 font-medium">Nombre de usuario</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-1 border border-gray-300 rounded-md"
          required
        />
        {checkingUsername && (
          <p className="text-sm text-gray-500">Verificando...</p>
        )}
        {usernameDisponible === true && (
          <p className="text-sm text-red-700">✅ Disponible</p>
        )}
        {usernameDisponible === false && (
          <p className="text-sm text-red-700">❌ Ya está en uso</p>
        )}

        <label className="block mt-4 mb-1 font-medium">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />

        <label className="block mt-4 mb-1 font-medium">Apellido</label>
        <input
          type="text"
          name="apellido"
          value={form.apellido}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />

        <label className="block mt-4 mb-1 font-medium">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        {checkingEmail && (
          <p className="text-sm text-gray-500">Verificando correo...</p>
        )}
        {emailDisponible === true && (
          <p className="text-sm text-red-700">✅ Disponible</p>
        )}
        {emailDisponible === false && (
          <p className="text-sm text-red-700">❌ Ya está registrado</p>
        )}

        <label className="block mt-4 mb-1 font-medium">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />

        <label className="block mt-4 mb-1 font-medium">
          Repetir contraseña
        </label>
        <input
          type="password"
          name="repeatPassword"
          value={form.repeatPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          required
        />

        <button
          type="submit"
          className="w-full mt-6 bg-red-700 text-white py-2 rounded-md hover:bg-red-700 transition"
          disabled={usernameDisponible === false || checkingUsername}
        >
          Registrarse
        </button>

        <p className="text-center text-sm mt-4 text-gray-700">
          ¿Ya tenés una cuenta?{" "}
          <Link to="/login" className="text-red-700 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
