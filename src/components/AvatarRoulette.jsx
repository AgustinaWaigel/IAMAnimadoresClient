import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
const avatarOptions = [
  { src: "/avatars/carlosacutis.jpg", desc: "Carlo Acutis (1991–2006) fue un joven italiano apasionado por la Eucaristía y la tecnología. Usó Internet para difundir su fe. Murió a los 15 años y fue beatificado en 2020 como ejemplo de santidad juvenil." },
  { src: "/avatars/drjosegregoriohernandez.jpg", desc: "José Gregorio Hernández (1864–1919), médico venezolano, dedicó su vida a sanar a los pobres con fe y amor. Fue beatificado en 2021 como ejemplo de caridad cristiana." },
  { src: "/avatars/juanadearco.jpg", desc: "Juana de Arco (1412–1431) fue una joven francesa que, guiada por su fe, lideró ejércitos en la Guerra de los Cien Años. Murió a los 19 años y hoy es santa y heroína nacional." },
  { src: "/avatars/juanmariavianet.jpg", desc: "San Juan María Vianney (1786–1859) fue un sacerdote francés ejemplar en humildad y dedicación. Patrono de los párrocos, transformó con su fe la aldea de Ars." },
  { src: "/avatars/madremercedespacheco.jpg", desc: "Madre Mercedes Pacheco, Ejemplo de caridad" },
  { src: "/avatars/pabloapostol.jpg", desc: "San Pablo Apóstol fue un gran misionero del cristianismo. De perseguidor pasó a ser un incansable predicador de Jesús." },
  { src: "/avatars/sanagustindehipona.jpg", desc: "San Agustín de Hipona (354–430) fue un gran teólogo y obispo cristiano. De joven rebelde pasó a ser uno de los principales pensadores de la Iglesia." },
  { src: "/avatars/sanantoniopadua.jpg", desc: "San Antonio de Padua (1195–1231) fue un gran predicador franciscano, conocido por su sabiduría y caridad. Protector de los necesitados" },
  { src: "/avatars/sanignaciodeloyola.jpg", desc: "San Ignacio de Loyola (1491–1556) fue fundador de los jesuitas. De militar pasó a ser un maestro de la vida espiritual y autor de los Ejercicios Espirituales." },
  { src: "/avatars/santaclaradeasis.jpg", desc: "Santa Clara de Asís (1193–1253) dejó una vida de riqueza para seguir a Cristo en pobreza. Fundó la Orden de las Clarisas y vivió dedicada a la oración." },
  { src: "/avatars/santadulcedelospobres.jpg", desc: "Santa Dulce de los Pobres (1914–1992) fue una religiosa brasileña que dedicó su vida a cuidar a los enfermos y necesitados. Fue canonizada en 2019." },
  { src: "/avatars/santaines.jpg", desc: "Santa Inés (c. 291–304) fue una joven mártir romana, ejemplo de pureza y fe firme en Cristo." },
  { src: "/avatars/santamonica.jpg", desc: "Santa Mónica (c. 331–387) es ejemplo de fe y perseverancia. Con sus oraciones logró la conversión de su hijo, San Agustín." },
  { src: "/avatars/santarcisio.jpg", desc: "San Tarsicio (siglo III) fue un joven mártir que murió protegiendo la Eucaristía. Es patrono de los monaguillos." },
  { src: "/avatars/sormarialudovica.jpg", desc: "Sor María Ludovica (1880–1962) fue una religiosa que dedicó su vida al cuidado de los niños pobres en La Plata. Fue beatificada en 2004." },
  { src: "/avatars/tomasdeaquino.jpg", desc: "Santo Tomás de Aquino (1225–1274) fue un gran teólogo que unió fe y razón. Su obra Suma Teológica es fundamental para la Iglesia." },
];

export default function AvatarRoulette({ onSelect }) {
  const [selected, setSelected] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const { user, updateUser } = useAuth();

  const spinRoulette = async () => {
    if (spinning) return;
    setSpinning(true);
  
    const randomIndex = Math.floor(Math.random() * avatarOptions.length);
  
    // 🎰 Animación del spin
    await new Promise(resolve => setTimeout(resolve, 1500));
  
    setSelected(randomIndex);
    setSpinning(false);
  
    // ✅ Solo después de terminar el spin, actualizamos en backend
    await handleSelectAvatar(avatarOptions[randomIndex]);
    onSelect && onSelect(avatarOptions[randomIndex]);
  };
  
  const handleSelectAvatar = async (avatar) => {
    console.log("🎯 Intentando guardar avatar:", avatar);
  
    try {
      const res = await fetch(api('/auth/update-avatar'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,

        },
        credentials: 'include',
        body: JSON.stringify({
          avatarUrl: avatar.src,
          avatarDesc: avatar.desc,
        }),
      });
  
      console.log("📡 Respuesta cruda:", res);
  
      const data = await res.json();
      console.log("📦 Data parseada:", data);
  
      if (res.ok && data.success) {
        console.log("✅ Avatar guardado en backend. Ahora actualizamos user");
        updateUser(data.user);
      } else {
        console.error("❌ Error en respuesta backend:", data.message);
      }
    } catch (err) {
      console.error('❌ Error en la petición de avatar:', err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <motion.img
        src={avatarOptions[selected].src}
        alt="Avatar Seleccionado"
        className="w-40 h-40 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
        animate={{ rotate: spinning ? 360 * 3 : 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <p className="text-gray-700 font-semibold">{avatarOptions[selected].desc}</p>
      
      <button
        onClick={spinRoulette}
        disabled={spinning}
        className={`px-6 py-2 rounded-full font-bold transition ${
          spinning ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        🎰 Girar Ruleta
      </button>
    </div>
  );
}
