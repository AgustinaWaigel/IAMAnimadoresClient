import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { usePush } from "./hooks/usePush";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

// Páginas
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import RecursosEdad from "./pages/RecursosEdad";
import Recursos from "./pages/Encuentros";
import Calendario from "./pages/Calendario";
import Inicio from "./pages/Inicio";
import Areas from "./pages/Areas";
import Noticias from "./pages/Noticias";
import EscuelaConJesus from "./pages/EscuelaConJesus";
import Comunicacion from "./pages/Comunicacion";
import PanelAdministracion from "./pages/AdminPanel";
import Animacion from "./pages/Animacion";
import Formacion from "./pages/Formacion";
import Espiritualidad from "./pages/Espiritualidad";
import Logistica from "./pages/Logistica";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Informacion from "./pages/Informacion";
import FormatoEscuelaConJesus from "./pages/FormatoEscuelaConJesus";
import MostrarNoticia from "./pages/mostrarNoticia";
import NoticiaDetalle from "./pages/noticiaDetalle";
import "./index.css";
import CrearNoticiaBloques from "./components/CrearNoticiaBloques";
import EditarNoticiaBloques from "./components/EditarNoticiaBloques";
import ProbarNotificacion from "./pages/ProbarNotificacion";
import { ConfirmProvider } from "./components/ConfirmProvider";

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation(); // ✅ estaba faltando esto
  const { solicitarPermiso } = usePush();

  useEffect(() => {
  const registrarTokenNotificaciones = async () => {
    const token = await solicitarPermiso();

    if (token) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notificaciones/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ token }),
      });
    }
  };

  if (user?.token) {
    registrarTokenNotificaciones();
  }
}, [user]);


  if (isLoading) return null;

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-white font-cute text-gray-700">
      <ConfirmProvider>
        <Navbar />

      <main className="flex-grow">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/inicio" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recursos/:edad" element={<RecursosEdad />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/areas" element={<Areas />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/comunicacion" element={<Comunicacion />} />
          <Route path="/logistica" element={<Logistica />} />
          <Route path="/formacion" element={<Formacion />} />
          <Route path="/espiritualidad" element={<Espiritualidad />} />
          <Route path="/animacion" element={<Animacion />} />
          <Route path="/mostrar-noticias" element={<MostrarNoticia />} />
          <Route path="/mostrar-noticias/:slug" element={<NoticiaDetalle />} />
          <Route path="/formatoescuelaconjesus" element={<FormatoEscuelaConJesus />} />
          <Route path="/escuelaconjesus" element={<EscuelaConJesus />} />
          <Route path="/paneladministracion" element={<PanelAdministracion />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/crear-noticia" element={<CrearNoticiaBloques />} />
          <Route path="/editar-noticia/:id" element={<EditarNoticiaBloques />} />
          <Route path="/probar-notificacion" element={<ProbarNotificacion />} />

        </Routes>
      </main>

      <footer className="mt-auto w-full py-4 text-center text-sm text-gray-500 border-t">
        <p>© {new Date().getFullYear()} App para Animadores</p>
        <p className="text-xs mt-1">Siempre hagamos todo con ❤️</p>
        <div className="flex justify-center gap-4 mt-2 text-blue-600">
          <a
            href="https://www.youtube.com/channel/UCShR66tuvm-N-I5ZUZ6Oo6Q"
            className="hover:underline"
          >
            Youtube
          </a>
          <a
            href="https://www.instagram.com/iamarqparana/?hl=es"
            target="_blank"
            className="hover:underline"
          >
            Instagram
          </a>
        </div>
      </footer>
      </ConfirmProvider>
    </div>
  );
}
