import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const usePush = () => {
  const solicitarPermiso = async (): Promise<string | null> => {
    console.log("📩 Solicitando permiso...");

    try {
      const permiso = await Notification.requestPermission();
      console.log("🔒 Permiso:", permiso);

      if (permiso !== "granted") {
        console.warn("❌ Permiso denegado");
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY
      });


      if (token) {
        console.log("✅ Token FCM:", token);
        return token;
      } else {
        console.warn("⚠️ No se obtuvo token");
      }
    } catch (err) {
      console.error("❌ Error en solicitarPermiso:", err);
    }
  };

  return { solicitarPermiso };
};

