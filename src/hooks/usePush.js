import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";

export const usePush = () => {
  const solicitarPermiso = async () => {
    try {
      const token = await getToken(messaging, {
        vapidKey: "BDT0kUdqKwG5eTYPtdSn7EBMd_ly3uBqss_kg7DRMDFtO2AYyzC5-MdNvuRUz_rfgYrpXFbH507C1nKhEezpUpo", // la que copiaste de Cloud Messaging
      });

      if (token) {
        console.log("✅ Token FCM:", token);
        return token;
      } else {
        console.warn("❌ No se obtuvo token");
      }
    } catch (err) {
      console.error("⚠️ Error obteniendo token:", err);
    }
  };

  return { solicitarPermiso };
};
