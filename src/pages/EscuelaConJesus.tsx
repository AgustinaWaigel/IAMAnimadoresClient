import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Escuelaconjesus() {
  const navigate = useNavigate();
  const bloques = [
    [
      "Catequesis misionera",
      `<p>
  <strong>Catequesis misionera:</strong> Se trata del <strong>primer paso</strong> de la <strong>Escuela con Jesús</strong>.<br /><br />
  En este encuentro, se planteará el <strong>Tema</strong> que se abordará durante el ciclo.<br />
  Se lo define como un encuentro de <strong>“estudio y reflexión”</strong>; se anima a que los <strong>niños y adolescentes</strong><br />
  <strong>aprendan</strong>, <strong>conozcan</strong> algo más acerca de <strong>Jesús</strong>, la <strong>Iglesia</strong> y la <strong>misión</strong>.<br />
  <strong>Objetivos con acciones:</strong> conocer, escuchar, aprender, saber, descubrir...<br />
  La <strong>Palabra</strong> como <strong>lugar privilegiado de encuentro y conocimiento</strong>.<br /><br />
  <em>Nota:</em> Si bien en este encuentro se prioriza la Palabra como fuente, la misma está presente en todos los encuentros del ciclo; en <strong>ninguno debe obviarse</strong>.<br />
  <strong>Algunas consideraciones para Catequesis misionera:</strong><br />
  Todos los encuentros del ciclo son <strong>igual de importantes</strong>.<br />
  No se pueden <strong>suprimir momentos</strong> de la estructura del encuentro y tampoco se pueden <strong>extender varias semanas</strong> un mismo encuentro dentro del ciclo.<br />
  Todos los encuentros deben tener <strong>relación con el tema general del ciclo</strong>.
</p>

`,
    ],
    [
      "Espiritualidad misionera",
      `<p>
  <strong>Espiritualidad Misionera:</strong><br /><br />
  Segundo paso del ciclo, consiste en un Encuentro de <strong>“Celebración”</strong>, en tanto tiene como propósito que todo lo <strong>aprendido</strong> por el niño y adolescente en la <strong>Catequesis Misionera</strong> ahora sea <strong>interiorizado</strong>, <strong>incorporado</strong>, que se <strong>viva</strong> y se <strong>haga vida</strong> en el corazón.<br />
  El <strong>tema central</strong> dependerá del tema tratado en el encuentro anterior, y la <strong>fuerza</strong> estará puesta en <strong>profundizar la Palabra de Dios</strong>.<br />
  Lo central es <strong>vivir esa Palabra dada</strong>, es importante que el <strong>mensaje del encuentro anterior</strong> se <strong>haga vida</strong> y se <strong>celebre</strong>.<br /><br />
  <strong>Objetivos:</strong> celebrar, vivir o vivenciar, incorporar, interiorizar, experimentar, profundizar...
</p>
`,
    ],
    [
      "Proyección misionera",
      `<p>
  <strong>Proyección Misionera:</strong><br /><br />
  Tercer encuentro del Ciclo, aquí se ayuda a los niños y adolescentes para que den el paso de <strong>“ser” amigos de Jesús</strong> a <strong>“hacer” amigos para Jesús</strong>, compartiendo con los demás aquello que <strong>aprendieron</strong> (Catequesis) y <strong>vivieron</strong> (Espiritualidad).<br />
  El <strong>servicio misionero</strong> será <strong>evangelizando</strong> y haciendo <strong>animación misionera</strong> hacia todas las personas, especialmente hacia otros niños y adolescentes.<br />
  En todos los encuentros y actividades de la IAM se asumen <strong>compromisos misioneros</strong> y se <strong>revisa su cumplimiento</strong>. En estos encuentros de proyección se destaca esta dimensión. Por ello, se asume con mayor fuerza nuestro <strong>compromiso misionero</strong> (cooperación espiritual, material y con servicios).<br />
  En este sentido, se procura que los <strong>gestos misioneros</strong> de este encuentro sean siempre <strong>novedosos, variados y creativos</strong>.<br /><br />
  <strong>Objetivos:</strong> contar, hacer, comunicar, generar, llevar, construir, decir, anunciar, compartir, colaborar, ayudar...
</p>
<br />
<p>
  <strong>Algunas consideraciones para Proyección Misionera:</strong><br /><br />
  En este encuentro se destacan los <strong>compromisos</strong> que cada niño debe proponerse y cumplir. Estos deben ser <strong>elegidos por el niño</strong>, el animador <strong>NO</strong> puede darles un compromiso, pero sí los puede <strong>guiar</strong> para que sean en base al objetivo del encuentro.<br />
  En algunos casos puede haber excepciones en los que se plantean <strong>temas u oraciones</strong> (ejemplo: "rezar por la salud del papa"), preguntándoles a los niños y adolescentes si <strong>quieren y están dispuestos</strong> a cumplir ese compromiso.<br />
  También recordar que la IAM ha sido creada con el objetivo de <strong>“un Ave María al día, una monedita al mes”</strong>. Al rezar un Ave María en la oración final, se <strong>cumple el compromiso</strong>.<br />
  Este es el único encuentro que, en caso de ser necesario, es posible <strong>prolongarlo en dos encuentros</strong>, cuando la propuesta requiera uno para <strong>organizarla</strong> y otro para <strong>ejecutarla</strong>.
</p>
`,
    ],
    [
      "Comunión misionera",
      `<p>
  <strong>Comunión Misionera:</strong><br /><br />
  ¡Llegamos al <strong>final del ciclo</strong>, al <strong>cuarto encuentro</strong>!<br />
  Tiene como eje <strong>“volver al grupo”</strong>, <strong>encontrarnos como comunidad</strong> para fortalecernos, limar asperezas, crecer en valores y en gestos. Para el próximo encuentro, comenzamos un nuevo ciclo de la <strong>Escuela con Jesús</strong>.<br />
  Se anima a la recreación del <strong>compartir</strong> (a la manera de la Última Cena) y fortalecer.<br />
  En estos encuentros se anima a la <strong>comunión</strong>, en primera instancia, al interior de cada grupo, luego entre grupos de IAM de la comunidad, entre otros grupos parroquiales, etc.<br /><br />
  <strong>Objetivos:</strong> afianzar, pulir, enriquecer, festejar, compartir, acrecentar, fortalecer...
</p>
<br />
<p>
  <strong>Algunas consideraciones para Comunión Misionera:</strong><br /><br />
  Como ya dijimos, <strong>todos los encuentros deben tener relación con el tema general del ciclo</strong>.<br />
  Solamente si es <strong>necesario</strong> (se trata de una excepción), el encuentro de Comunión Misionera puede <strong>no tener relación temática</strong> con el ciclo. Esto puede suceder si, durante el desarrollo de los encuentros, ocurre algún hecho dentro del grupo que deba ser abordado.<br />
  (Considerando que el objetivo de la Comunión Misionera es <strong>pulir</strong>, <strong>afianzar lazos</strong>, <strong>limar asperezas</strong>).<br />
  También se recomienda que <strong>solo se dé la merienda</strong> en este ciclo, ya que este signo tiene un <strong>sentido profundo</strong>, más allá de “comer o tomar”.<br />
  Se pueden hacer excepciones, pero se debe recordar que esto es solo una <strong>recomendación</strong>.
</p>
`,
    ],
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
        className="text-5xl font-cute text-red-700 mb-6 text-center drop-shadow-lg"
      >
        Escuela con Jesús
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="text-gray-700 text-lg md:text-xl leading-relaxed text-center max-w-3xl mx-auto"
      >
        Tal como hemos desarrollado anteriormente, cada encuentro de la{" "}
        <strong>Escuela con Jesús</strong> tiene un propósito, una
        especificidad...
        <br />
        <br />
        Cuatro pasos, un ciclo. Cada ciclo de la Escuela con Jesús plantea un
        único Tema, del cual se abordara semanalmente desde cuatro pasos:
      </motion.p>

      <div className="space-y-6">
        {bloques.map(([titulo, contenido], i) => (
          <motion.details
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="border-2 border-red-200 rounded-2xl overflow-hidden shadow-md bg-red-100 p-5 group open:shadow-lg"
          >
            <summary className="font-semibold text-gray-700 text-xl cursor-pointer group-hover:text-red-700 transition-all">
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
        ✨ Esta estructura busca garantizar un proceso integral, sistemático y
        progresivo en la formación misionera de niños y adolescentes.
      </motion.p>
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/formatoescuelaconjesus")}
          className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-red-700 transition"
        >
          Ver todos los momentos que forman parte de un encuentro
        </button>
      </div>
    </motion.div>
  );
}
