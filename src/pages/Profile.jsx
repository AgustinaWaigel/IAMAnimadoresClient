import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { avatarOptions, getDeterministicAvatar } from "../data/avatarOptions";

export default function Profile() {
  const { user, updateUser } = useAuth();
  
  const initialAvatar = user?.avatarUrl 
    ? { src: user.avatarUrl, desc: user.avatarDesc } 
    : avatarOptions[0];

  const { src: avatarUrl } = getDeterministicAvatar(user?.username);

  const [avatar, setAvatar] = useState(initialAvatar);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinAvatar = async () => {
    if (isSpinning) return;
  
    setIsSpinning(true);
  
    const spins = 10;
    let index = Math.floor(Math.random() * avatarOptions.length);
  
    for (let i = 0; i < spins; i++) {
      index = (index + 1) % avatarOptions.length;
      setAvatar(avatarOptions[index]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  
    const finalAvatar = avatarOptions[index];
  
    try {
      const res = await fetch(api("/auth/avatar"), {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json', // 👈 muy importante para body JSON
          Authorization: `Bearer ${user?.token}`,
          credentials: 'include',
        },
        body: JSON.stringify({
          avatarUrl: finalAvatar.src,
          avatarDesc: finalAvatar.desc,
        }),
      });
  
      const data = await res.json();
      if (res.ok && data.success) {
        // ✅ ACTUALIZAR USER DEL CONTEXTO
        updateUser(prev => ({
          ...prev, // 🧠 mantiene username, email, rol, token, etc.
          avatarUrl: data.user.avatarUrl,
          avatarDesc: data.user.avatarDesc,
        }));
        
        console.log("✅ Avatar actualizado correctamente");
      } else {
        console.error("❌ Error al guardar avatar:", data.message);
      }
    } catch (err) {
      console.error("❌ Error en la petición de avatar:", err);
    } finally {
      setIsSpinning(false);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-xl mx-auto mt-12 p-8 bg-gradient-to-br from-white via-yellow-50 to-white rounded-3xl shadow-2xl"
    >
      <motion.h1
        className="text-4xl font-extrabold text-yellow-400 mb-8 text-center"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Mi Perfil
      </motion.h1>

      <div className="flex flex-col items-center space-y-6">
        <motion.img
          src={avatar.src}
          alt="Avatar"
          className={`w-36 h-36 object-cover rounded-full border-4 border-yellow-400 shadow-lg cursor-pointer ${isSpinning ? "animate-spin-slow" : ""}`}
          onClick={spinAvatar}
          whileHover={{ scale: 1.05 }}
        />

        <p className="text-2xl font-semibold text-gray-800">{user?.username}</p>
        <p className="text-gray-500 italic">{avatar.desc}</p>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-700"><strong>Email:</strong> {user?.email}</p>
        <p className="text-sm text-gray-400 mt-2 italic">
          ✨ Toca tu avatar para cambiarlo ✨
        </p>
      </div>
    </motion.div>
  );
}
