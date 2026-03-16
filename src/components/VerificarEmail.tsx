import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api"; // ajustá la ruta si está en otro lugar

export default function VerificarEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(api(`/verify-email/${token}`))
      .then((res) => res.text())
      .then((msg) => {
        alert(msg); // muestra el mensaje del backend
        navigate("/login?verificado=true");
      })
      .catch((err) => {
        console.error("Error al verificar email:", err);
        alert("❌ Hubo un problema al verificar tu correo.");
        navigate("/login");
      });
  }, [token]);

  return <p className="text-center p-4">Verificando correo electrónico...</p>;
}
