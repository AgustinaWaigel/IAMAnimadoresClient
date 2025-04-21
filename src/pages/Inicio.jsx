import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✨ Para animaciones suaves

const Inicio = () => {
  return (
    <div className="pb-10 flex flex-col items-center  text-center px-6 bg-gradient-to-b from-white to-yellow-100 " >
      <div className="bg-gradient-to-b from-amber-100 to-slate-10 h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
        <motion.h1
          className="text-4xl md:text-6xl font-cute text-red-700 mb-6 text-center px-4"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          "Misioneros de esperanza, entre los pueblos"
        </motion.h1>

        <motion.img
          src="/logo año diocesano.png"
          alt="Niña misionera"
          className="w-72 md:w-96"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-6 text-yellow-400 px-10 py-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Infancia y Adolescencia Misionera
      </motion.h1>

      <motion.p
        className="text-lg md:text-2xl text-gray-700 max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Te acompañamos en tu misión de animar, organizar y compartir recursos
        para crecer en comunidad. 💡✨
      </motion.p>

      <motion.img
        src="/imagenes/imagenabrazo.png"
        alt="Bienvenida"
        className="md:w-80 mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />

      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link
          to="/dashboard"
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-lg transition"
        >
          Ir al muro de publicaciones
        </Link>

        <Link
          to="/informacion"
          className="bg-white border border-yellow-400 hover:bg-yellow-50 text-yellow-500 font-semibold py-3 px-6 rounded-lg text-lg shadow-lg transition"
        >
          Conocer más
        </Link>
      </motion.div>

      <motion.p
        className="italic text-gray-500 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        "Todo lo que hagas, hazlo con amor." 💖
      </motion.p>
    </div>
  );
};

export default Inicio;
