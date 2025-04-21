import { motion } from "framer-motion";

export default function Escuelaconjesus() {
  const bloques = [
    [
      "Objetivos",
      `<p>Se trata de un momento previo al encuentro en el que se plantean los <strong>objetivos</strong> que queremos lograr.<br/><br/>
      Cada encuentro tiene un objetivo <strong>único</strong>, <strong>simple</strong> y <strong>propio</strong> según el ciclo que estémos transitando.<br/><br/>
      (Para formularlos, podemos recurrir a la lista de acciones o verboides que se ofrecieron en el material <em>Metodología de la IAM Parte I</em>), realizable (concreto) y evaluable.<br/><br/>
      El objetivo de cada encuentro debe <strong>relacionarse con el tema central del Ciclo</strong>.<br/><br/>
      Hay que evitar <strong>objetivos amplios</strong>, <strong>difíciles de concretar</strong> o de evaluar, abstractos o de un nivel de concreción casi imposible.<br/><br/>
      <em>Ejemplo:</em> \"Que los niños anuncien a todo el mundo que Dios los ama\" (es imposible que un niño anuncie a "todo el mundo").<br/><br/>
      <strong>Correcto:</strong> "Que el niño anuncie a sus vecinos que Dios lo ama" o "Que el niño rece un Ave María por todo el mundo como gesto de que Dios ama a todos".<br/></p>`
    ],
    [
      "Ambientación",
      `<p>Es sumamente importante y necesario que los espacios que utilizamos estén ambientados de acuerdo con los <strong>objetivos</strong> y el <strong>tema del ciclo</strong>.<br/><br/>
      Estas ambientaciones, en lo posible, <strong>no deben repetirse</strong> ni requerir un alto nivel de abstracción para comprenderlas.<br/><br/>
      Si tenemos que explicar el recurso que usamos, no es pertinente.<br/><br/>
      Crear el <strong>clima</strong> y el <strong>espacio</strong> para el encuentro: por ejemplo, si hablamos de María, colocar una imagen suya, telas celestes, flores, etc.<br/><br/>
      La ambientación cambia entre ciclos y en cada encuentro.<br/><br/>
      Siempre debe estar presente la <strong>Palabra</strong> en un lugar privilegiado.<br/><br/>
      La ambientación también invita a que los animadores <strong>esperen a los niños/adolescentes</strong> antes de comenzar el encuentro.</p>`
    ],
    [
      "Animación",
      `<p>Nos disponemos a <strong>romper el hielo</strong> y a poner en sintonía al grupo.<br/><br/>
      Una canción, una dinámica breve, el saludo de la IAM, o cantar el Himno son ideales.<br/><br/>
      La animación debe ser breve y relacionada con el tema del encuentro.</p>`
    ],
    [
      "Oración Inicial",
      `<p>En este momento ponemos en manos de Jesús lo que vamos a vivir.<br/><br/>
      <strong>Saludamos a quien nos llama</strong> y disponemos el corazón.<br/><br/>
      No es necesario hacer una oración extensa, sino <strong>abierta y sincera</strong>.</p>`
    ],
    [
      "Testimonio",
      `<p>Nos encontramos <strong>como personas</strong> y compartimos experiencias de la semana.<br/><br/>
      Preguntas como \"¿Cómo estás?\", \"¿Qué te pasó?\" ayudan a conectar.<br/><br/>
      Revisamos los <strong>compromisos misioneros</strong> asumidos.<br/><br/>
      También presentamos la <strong>Alcancía Misionera</strong> para el aporte solidario semanal.</p>`
    ],
    [
      "Experiencia de Vida",
      `<p>Traemos la <strong>vida real</strong> del niño/adolescente al encuentro.<br/><br/>
      Juegos, dinámicas, cuentos, imágenes o canciones ayudan a conectar.<br/><br/>
      La experiencia debe ser <strong>variada, creativa</strong> y no repetitiva.<br/><br/>
      No debemos dar definiciones, sino que el niño descubra por sí mismo el mensaje.</p>`
    ],
    [
      "Iluminación",
      `<p><strong>La Palabra de Dios</strong> ilumina la experiencia vivida.<br/><br/>
      La cita debe ser adecuada a la edad y comprensible.<br/><br/>
      No se debe suprimir la lectura; se puede acompañar de imágenes o representaciones para facilitar su comprensión.</p>`
    ],
    [
      "Dinámica/Actividad",
      `<p>Momento para reflexionar jugando.<br/><br/>
      Las actividades deben vincular la <strong>experiencia de vida</strong> y la <strong>Palabra</strong>.<br/><br/>
      Ejemplo: Dinámica sobre compartir si trabajamos ese tema.<br/><br/>
      Cada paso (catequesis, espiritualidad, proyección, comunión) tiene un tipo de actividad específica.</p>`
    ],
    [
      "Compromisos",
      `<p>Tiempo para asumir <strong>compromisos misioneros</strong> personales.<br/><br/>
      El niño/adolescente debe elegirlo libremente, no impuesto por el animador.<br/><br/>
      Hay 3 tipos: personales, ambientales y más allá de las fronteras.<br/><br/>
      Se registran en el <strong>Cuaderno Misionero</strong> de cada uno.</p>`
    ],
    [
      "Oración Final",
      `<p>Encuentro íntimo y breve con Jesús para dar gracias y sellar el compromiso.<br/><br/>
      Se puede finalizar rezando juntos el <strong>Ave María por día</strong>.<br/><br/>
      No puede omitirse ningún momento ni cambiar su orden.</p>`
    ]
  ];

  return (
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1 }}
  className=" mx-auto p-8 space-y-12 bg-white shadow-lg mt-8"
>
  <motion.h1
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="text-5xl font-cute text-yellow-400 mb-6 text-center drop-shadow-lg"
  >
    Escuela con Jesús
  </motion.h1>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 1 }}
    className="text-gray-700 text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto"
  >
    Tal como hemos desarrollado anteriormente, cada encuentro de la <strong>Escuela con Jesús</strong> tiene un propósito, una especificidad...
    <br /><br />Los momentos dentro de un Encuentro de la Escuela con Jesús son los siguientes:
  </motion.p>

  <div className="space-y-6">
    {bloques.map(([titulo, contenido], i) => (
      <motion.details
        key={i}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.05 }}
        className="border-2 border-yellow-200 rounded-2xl overflow-hidden shadow-md bg-yellow-100 p-5 group open:shadow-lg"
      >
        <summary className="font-semibold text-gray-700 text-xl cursor-pointer group-hover:text-yellow-400 transition-all">
          {titulo}
        </summary>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-700 text-[17px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: contenido }}
        />
      </motion.details>
    ))}
  </div>

  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="mt-10 text-center text-sm italic text-gray-500"
  >
    ✨ Esta estructura busca garantizar un proceso integral, sistemático y progresivo en la formación misionera de niños y adolescentes.
  </motion.p>
</motion.div>

  );
}
