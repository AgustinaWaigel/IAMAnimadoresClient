import { motion } from "framer-motion";
import { useState } from "react";

const secciones = [
  {
    titulo: "Historia de la IAM",
    portada: "/informacion/iam.jpg",
    tarjetas: [
      {
        titulo: "Infancia y Adolescencia Misionera",
        imagen: "/informacion/informacion.jpg",
        contenido: (
          <div>
            <p>
              Es una obra de <b>los niños y adolescentes</b> en favor de{" "}
              <b>los niños y adolescentes</b>.
            </p>
            <p>
              Es un espacio donde ellos no solo son destinatarios de formación y
              servicios, sino que se transforman en{" "}
              <b>verdaderos protagonistas</b> de los mismos.
            </p>
            <p>
              Es una Obra <b>por, para, con y de los niños y adolescentes</b> en
              favor de la <b>Iglesia universal</b> y de{" "}
              <b>los niños y adolescentes del mundo</b>.
            </p>
          </div>
        ),
      },
      {
        titulo: "Historia",
        imagen: "/informacion/historia.jpg",
        contenido: (
          <div>
            <p>
              La Infancia y Adolescencia Misionera (IAM) nació en <b>1843</b>,
              fundada por <b>Mons. Carlos Augusto Forbin-Janson</b> en Francia,
              motivado por las cartas de misioneros (especialmente de China) que
              relataban la situación de muchos niños sin bautizar y en
              condiciones muy precarias.
            </p>
            <p>
              Monseñor Forbin-Janson propuso una obra en la que{" "}
              <b>los niños ayudaran a otros niños</b> mediante la oración y la
              ayuda material. Así surgió el lema:{" "}
              <b>
                "Que los niños (y adolescentes) ayuden a los niños (y
                adolescentes)"
              </b>
              .
            </p>
            <p>
              La Obra se expandió rápidamente por Europa y América, y en{" "}
              <b>1922</b> el Papa <b>Pío XI</b> la elevó a categoría de{" "}
              <b>Obra Pontificia</b>, proponiéndola como una escuela de fe para
              los niños cristianos.
            </p>
            <p>
              En <b>Argentina</b>, la Santa Infancia llegó en <b>1849</b>. La
              primera colecta registrada fue en <b>Tucumán en 1896</b>.
            </p>
            <p>
              Desde <b>2002</b>, tras un Encuentro Continental, se formalizó
              también la animación de adolescentes, cambiando el nombre a{" "}
              <b>Infancia y Adolescencia Misionera (IAM)</b>.
            </p>
            <p>
              Hoy, en Argentina, la IAM está presente en casi todas las
              diócesis, con más de <b>475 grupos</b> y más de{" "}
              <b>15.000 miembros</b> activos.
            </p>
          </div>
        ),
      },
      {
        titulo: "Objetivos",
        imagen: "/informacion/objetivos.jpg",
        contenido:
        <div>
        <p>
          • Ayudar a los educadores (en Argentina: Animadores) a <b>despertar progresivamente en los niños la conciencia misionera universal</b> (Estatutos OMP III, N° 17).
        </p>
        <p>
          • <b>Promover la conciencia y el compromiso misionero de los niños</b>.
        </p>
        <p>
          • <b>Dar apertura misionera a la educación cristiana</b> (Estatutos OMP, Cap. II, Art. III, n° 19).
        </p>
        <p>
          • <b>Motivar a los niños a compartir su Fe y los medios materiales</b> con los niños de las regiones e iglesias más necesitadas (Estatutos OMP III, 17 y 20).
        </p>
        <p>
          • <b>Promover las vocaciones misioneras</b> (Estatutos OMP 17 – RM 84).
        </p>
      </div>
      ,
      },
      {
        titulo: "Fundador",
        imagen: "/informacion/forbinjanson.jpg",
        contenido: (
          <div>
            <p>
              <b>Carlos Augusto Forbin-Janson</b> fue un <b>obispo francés</b>,
              fundador de la Santa Infancia en <b>1843</b>.
            </p>
            <p>
              Inspirado por las necesidades de los niños en tierras de misión,
              propuso una obra donde <b>los propios niños</b> se comprometieran
              a <b>orar y colaborar materialmente</b> para ayudar a otros niños
              necesitados.
            </p>
            <p>
              Puso la Obra bajo la <b>protección del Niño Jesús</b>, entendiendo
              la infancia como una etapa sagrada y un modelo de vida cristiana.
            </p>
            <p>
              Frente a la falta de respuesta de los adultos, Forbin-Janson
              acudió directamente a los niños, pidiéndoles{" "}
              <b>"un Ave María cada día y una moneda al mes"</b> para colaborar
              con la misión.
            </p>
          </div>
        ),
      },
      {
        titulo: "Paulina Jaricot",
        imagen: "/informacion/paulinajaricot.jpg",
        contenido: (
          <div>
            <p>
              <b>Paulina Jaricot</b> fue una <b>laica francesa</b>, fundadora de
              la <b>Obra de la Propagación de la Fe</b> en <b>1822</b>.
            </p>
            <p>
              Cuando Forbin-Janson le consultó su idea de fundar una obra para
              los niños, <b>Paulina lo animó</b> y quiso ser la{" "}
              <b>primera miembro</b> de la nueva obra.
            </p>
            <p>
              Ella reconoció el valor original del proyecto:{" "}
              <b>niños ayudando a niños</b>, y lo entendió como una "propagación
              de la fe para los niños".
            </p>
          </div>
        ),
      },
    ],
  },
  {
    titulo: "Modelos de la IAM",
    portada: "/informacion/jesusymaria.jpg",
    tarjetas: [
      {
        titulo: "Jesús: el primer misionero, enviado del Padre",
        imagen: "/informacion/jesus.jpg",
        contenido: (
          <div>
            <p>
              Es el modelo supremo que <b>los niños deben seguir</b>, ser
              cristianos es <b>ser imitadores de Cristo</b>.<br />
              <br />
              Enviado por el Padre, es modelo de <b>amor</b>, de{" "}
              <b>obediencia</b>, de <b>servicio</b>, de <b>vida en oración</b>,
              encarnado para revelar el amor del Padre a todos los hombres.
              <br />
              <br />
              Todo lo que Jesús hizo en la tierra es{" "}
              <b>lo que nosotros debemos imitar</b>.
            </p>
          </div>
        ),
      },
      {
        titulo: "María: la Primera Misionera",
        imagen: "/informacion/maria.jpg",
        contenido: (
          <div>
            <p>
              Ella es la <b>primera misionera de Jesús</b>, dijo sí a su misión
              y la cumplió con <b>entrega</b>, <b>generosidad</b>, con{" "}
              <b>alegría</b> y <b>sencillez</b> y así fue <b>Madre de Dios</b>.
              <br />
              <br />
              También dijo sí a la misión que le encomendara el Hijo:{" "}
              <b>ser Madre nuestra</b>.<br />
              <br />
              Desde el momento mismo de la Anunciación, María comenzó a ayudar
              en la <b>salvación de todos los hombres</b>.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    titulo: "Patronos de la IAM",
    portada: "/informacion/patronos.png",
    tarjetas: [
      {
        titulo: "San Francisco Javier",
        imagen: "/informacion/JAVIER.jpg",
        contenido: (
          <div>
            <p>
              Sacerdote jesuita, <b>gran misionero</b> sobre todo en{" "}
              <b>la India y Japón</b>, anunciando a Jesús, bautizando a miles de
              niños y, por sobre todo, haciendo{" "}
              <b>grandes y pequeños amigos para Jesús</b>.<br />
              <br />
              Su <b>vida de oración</b> lo llevó a encarnar el Evangelio y a
              integrarse completamente a la <b>actividad misionera</b>.<br />
              <br />
              Su gran preocupación era que{" "}
              <b>todos conozcan a Cristo, lo amen y lo sigan</b>.<br />
              <br />
              Su fiesta se celebra el día <b>3 de diciembre</b>.
            </p>
          </div>
        ),
      },
      {
        titulo: "Santa Teresita del Niño Jesús",
        imagen: "/informacion/santateresita.jpg",
        contenido: (
          <div>
            <p>
              Carmelita de clausura, dedicó su vida a{" "}
              <b>orar por las misiones</b>.<br />
              <br />
              Fue un ejemplo admirable de la <b>cooperación misionera</b> porque
              ofrecía los sacrificios diarios y sus oraciones por las misiones.
              <br />
              <br />
              Por eso el Papa <b>Pío XI</b> le dio el título de{" "}
              <b>Patrona Universal de las Misiones</b>, aunque nunca salió de su
              convento.
              <br />
              <br />
              Su fiesta se celebra el día <b>1 de octubre</b>.
            </p>
          </div>
        ),
      },
    ],
  },
  {
    titulo: "Insignias de la IAM",
    portada: "/informacion/iam1.jpg",
    tarjetas: [
      {
        titulo: "Carnet",
        imagen: "/informacion/carnet.jpg",
        contenido:
        <div>
        <p>
          Es la primer insignia oficial que se entrega en el proceso formativo que realiza el niño, adolescente o animador en la Obra y que lo identifica como miembro activo.
        </p>
      </div>
      ,
      },
      {
        titulo: "Escudo",
        imagen: "/informacion/escudo.jpg",
        contenido:
        <p>
          Es la segunda insignia oficial que se entrega al niño, adolescente o animador y lo identifica en su compromiso asumido en la IAM.
        </p>,

      },
      {
        titulo: "Pañoleta",
        imagen: "/informacion/pañoleta.jpg",
        contenido:
        <p>
          Es la tercera insignia oficial que se entrega. Simboliza la consagración asumida en la IAM.
        </p>,
      },
    ],
  },
];

function Tarjeta({ titulo, imagen, contenido }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border overflow-hidden flex flex-col hover:shadow-2xl transition"
    >
      <motion.img
        src={imagen}
        alt={titulo}
        initial={{ scale: 1.1 }}
        whileHover={{ scale: 1 }}
        className=" h-full object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-rose-700 mb-4">{titulo}</h3>
        <p
          className={`text-gray-700 text-base ${
            expandido ? "" : "line-clamp-3"
          }`}
        >
          {contenido}
        </p>
        <button
          onClick={() => setExpandido(!expandido)}
          className="mt-6 text-yellow-600 hover:text-yellow-800 transition self-start text-sm"
        >
          {expandido ? "Leer menos" : "Leer más"}
        </button>
      </div>
    </motion.div>
  );
}

export default function HistoriaIAM() {
  return (
    <div className="bg-gradient-to-b from-yellow-100 via-white to-yellow-100 min-h-screen py-16 px-4 md:px-20 space-y-24">
      {secciones.map((seccion, idx) => (
        <motion.section
          key={idx}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-12"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[250px] sm:min-h-[400px]">
            <motion.img
              src={seccion.portada}
              alt="Portada"
              className="w-full h-full object-cover absolute inset-0"
              initial={{ scale: 1.2 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-5xl font-extrabold text-white drop-shadow-lg text-center">
                {seccion.titulo}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
            {seccion.tarjetas.map((tarjeta, idx2) => (
              <Tarjeta key={idx2} {...tarjeta} />
            ))}
          </div>
        </motion.section>
      ))}
    </div>
  );
}
