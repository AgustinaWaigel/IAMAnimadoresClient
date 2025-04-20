import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const areas = [
  {
    name: "Comunicación",
    color: "bg-blue-100",
    text: "text-blue-800",
    img: "/area/comunicacion.png",
    path: "/comunicacion",
  },
  {
    name: "Logística",
    color: "bg-red-100",
    text: "text-red-800",
    img: "/area/logistica.png",
    path: "/logistica",
  },
  {
    name: "Espiritualidad",
    color: "bg-gray-100",
    text: "text-gray-700",
    img: "/area/espiritualidad.png",
    path: "/espiritualidad",
  },
  {
    name: "Animación",
    color: "bg-green-100",
    text: "text-green-800",
    img: "/area/animacion.png",
    path: "/animacion",
  },
  {
    name: "Formación",
    color: "bg-yellow-100",
    text: "text-yellow-800",
    img: "/area/formacion.png",
    path: "/formacion",
  },
];

export default function Areas() {
  return (
    <div className=" min-h-screen flex flex-col items-center text-center px-6 py-12 bg-gradient-to-b from-white via-yellow-50 to-white">
      <motion.h1
        className="font-mifuentepersonalizada text-5xl md:text-6xl mb-6 text-yellow-400 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Áreas de la IAM
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Esta sección representa las diferentes áreas que forman parte de nuestra
        Infancia y Adolescencia Misionera.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {areas.map((area, idx) => (
          <motion.div
            key={area.name}
            className={`${area.color} ${area.text} rounded-2xl shadow-lg p-6 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 cursor-pointer`}
            whileHover={{ y: -5 }}
          >
            <Link
              to={area.path}
              className="flex flex-col items-center space-y-4"
            >
              <img
                src={area.img}
                alt={area.name}
                className="w-24 h-24 object-contain"
              />
              <span className=" text-2xl font-bold">{area.name}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        className="italic text-gray-500 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        "Todo lo que hagas, hazlo con amor." 💖
      </motion.p>
    </div>
  );
}
