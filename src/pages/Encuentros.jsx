import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Recursos() {
  const edades = [
    { id: "pequeños", label: "Pequeños", colorClass: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-4 border-yellow-400"},
    { id: "ninos", label: "Niños", colorClass: "bg-green-100 text-green-800 hover:bg-green-200 border-4 border-green-400" },

    { id: "preadolescentes", label: "Preadolescentes", colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-4 border-blue-400"},
    { id: "adolescentes", label: "Adolescentes", colorClass: "bg-red-100 text-red-800 hover:bg-red-200 border-4 border-red-400"},
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-red-50 py-12 px-6 space-y-16">
      <motion.h1 
        className="text-4xl font-extrabold text-center text-red-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      Encuentros y Recursos
      </motion.h1>

      <motion.p 
        className="text-center text-gray-700 max-w-2xl mx-auto text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        La idea principal de esta sección es que podamos compartir los encuentros que armamos con amor todos los sabados, para que entre animadores podamos compartir ideas y recursos.
      </motion.p>

      <section className="space-y-8">
        <motion.h2 
          className="text-2xl font-bold text-red-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Edades
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {edades.map((e, idx) => (
            <motion.div
              key={e.id}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/recursos/${e.id}`}
                className={`${e.colorClass} rounded-xl shadow-lg overflow-hidden flex flex-col items-center justify-center text-center transition transform hover:scale-105 hover:shadow-2xl p-4`}
              >
                <span className="font-semibold text-lg">{e.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
