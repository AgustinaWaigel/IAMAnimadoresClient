import { motion } from "framer-motion";

export default function Escuelaconjesus() {
  const bloques =[
    ["Objetivos", `
      Se trata de un momento previo al encuentro en el que se plantean los objetivos que queremos lograr. 
      Cada encuentro tiene un objetivo único, simple, propio según el encuentro del ciclo que estemos transitando 
      (para formularlos, podemos recurrir a la lista de acciones o verboides que se ofreció en el material 
      Metodología de la IAM Parte I), realizable (concreto) y evaluable. 
      El objetivo de cada encuentro debe relacionarse con el tema central del Ciclo. 
      Hay que evitar objetivos amplios, difíciles de concretar o de evaluar, abstractos o de un nivel de concreción casi imposible 
      (ejemplo: "Que los niños anuncien a todo el mundo que Dios los ama" -es imposible que un niño anuncie a "todo el mundo"-); 
      es necesario concretar, hacer una bajada real y específica del mismo, por ejemplo: 
      "Que el niño anuncie a sus vecinos que Dios lo ama" o bien "que el niño rece un Ave María por todo el mundo como gesto de que Dios ama a todos".
      `],
      ["Ambientación", `Es sumamente importante y necesario que los espacios que utilizamos
      estén ambientados de acuerdo con los objetivos y el tema del ciclo y
      que estas ambientaciones, en lo posible, no sean repetidas ni
      requieran un alto nivel de abstracción para comprenderlas (si tenemos
      que explicar el recurso que utilizamos, es señal de que el mismo no es
      pertinente; cada recurso debe ser lo suficientemente claro para
      explicarse a sí mismo"). Se trata de crear el clima, generar el
      espacio en el cual el niño/adolecente va a vivir el encuentro (si
      vamos a hablar de María, por ejemplo, sería bueno colocar una imagen
      de la Virgen, alguna tela de color blanco, celeste, rosa o elementos
      -flores- que hagan referencia a María). La ambientación cambia entre
      ciclos y al interior de cada ciclo (los niños/adolescentes, aunque sea
      por la presencia de un signo o elemento en la ambientación, debe poder
      percibir la diferencia entre "catequesis, espiritualidad, proyección y
      comunión misionera"). lo que viene, que le genere expectativas y, al
      mismo tiempo, les dé un indicio acerca de lo que viviran. Siempre es
      importante que en la ambientación esté la Palabra presente en algún
      lugar privilegiado (un altar decorado que, se sugiere, esté siempre en
      el mismo lugar del salón, ya que ayuda a que el niño/adolescente
      comprenda que "aqui, en este espacio" vamos a detenernos a Escuchar la
      Palabra que se pronuncia). Recordar que la Palabra es el lugar
      privilegiado de encuentro del niño y adolescente durante el encuentro,
      por lo que ese espacio debe estar preparado con mucho cuidado y
      dedicación. La ambientación, además, promueve que los animadores estén
      ANTES del comienzo del encuentro, esperando a los niños/adolescentes.
      Es importante descubrir que los animadores representan a la Iglesia
      que espera, recibe y acoge a los niños y adolescentes al encuentro con
      Jesús, por lo que es fundamental que cuando ellos lleguen, los
      animadores los estén esperando con todo preparado.`],
      ["Animación", `Nos disponemos a prepararnos para el encuentro. Tiene como propósito
      disponer, "romper el hielo", poner en sintonía a los niños y
      adolescentes (por esta razón, no es necesario que la animación ocupe
      tanto tiempo). Una canción, una dinámica de presentación breve, el
      saludo de la IAM, el canto del Himno de la IAM, son especiales para
      realizar aquí. Es necesario que si cantamos cancionestengan que ver
      con lo que se va a tratar en el encuentro.`],
      ["Oración Inicial", `Ponemos en manos de Jesús lo que vamos a vivir, dándole gracias por
      permitimos estar juntos en este encuentro. Tiene como propósito
      "saludar" a quien nos llama al Encuentro, disponer el corazón a vivir
      esta experiencia. Nos abrimos a la Presencia de quien nos llama, nos
      invita a ser sus amigos. Como todo el encuentro debe vivirse con esta
      disposición del corazón, no es necesario que se trate de una oración
      extensa.`],
      ["Testimonio", `Este momento tiene un doble sentido, por un lado entender que nos
      encontramos entre personas (a veces, con la prisa de llegar a cumplir
      con todos los momentos del encuentro nos olvidamos de que estamos
      frente a niños/adolescentes, con historias, con una semana vivida en
      la que pudo haberles sucedido muchas cosas que quieren traer al
      encuentro), por eso lo importante es encontrarnos desde nuestras
      vivencias, a través de preguntas del tipo: "¿Cómo estás? ¿Cómo te fue
      en la semana? ¿Qué te pasó?" para conectar con la vida del
      niño/adolescente. Por otro lado, en este momento es importante que los
      niños, adolescentes iy animadores! compartan cómo les fue con el
      compromiso misionero asumido en el encuentro anterior. El testimonio
      tiene que estar siempre, no es pérdida de tiempo sino capitalización
      de la experiencia vivida (por eso es tan importante que haya un
      animador cada doce niños/adolescentes; de lo contrario, con grupos tan
      numerosos, esta instancia no se puede lograr porque no es posible
      dedicarle a cada uno el tiempo que necesita). En este momento es
      fundamental la Revisión de los Compromisos Misioneros en los que los
      niños, adolescentes y animadores deberán ser sinceros en cuanto a si
      pudieron o no cumplirlos. También, es en este momento en el que se
      pone a la vista la Alcancia Misionera para que los niños, adolescentes
      y animadores puedan aportar lo que hayan recaudado en la semana (el
      compromiso misionero a través de la cooperación material es un
      testimonio para los demás que, además, refuerza y hace visible el
      carisma de la Obra)`],
      ["Experiencia de Vida", ` Se trata de uno de los tres grandes momentos de cada encuentro que
      figuran en cualquier manual o material teórico de la IAM (por eso lo
      señalamos con otro color); tiene como propósito traer la vida del
      niño/adolescente al grupo, al encuentro, a la luz del tema que se va a
      abordar. En este momento, los animadores son los encargados de motivar
      a los chicos para "meterlos", introducirlos propiamente en el tema. Se
      pueden realizar y utilizar diferentes actividades y recursos: juegos,
      dinámicas, recursos audiovisuales, canciones, preguntas, imágenes,
      fotografías, un cuento, etcétera, que conecten al niño/adolescente con
      sus vivencias más profundas que luego serán iluminadas con la Palabra.
      La Experiencia de Vida, al pretender conectar el tema con una vivencia
      y al poder hacerlo con una gran variedad de recursos, debiera ser
      siempre variada, dinámica, creativa (si en un encuentro utilizo un
      video, en otro usaré una canción, en otro un juego, en otro una
      dinámica, etcétera. Es necesario evitar repetir recursos). Ejemplo: Si
      vamos a hablar acerca del "compartir", es necesario que, a través de
      preguntas, un juego, una dinámica, una canción, o lo que creamos
      mejor, el niño/adolescente traigo al encuentro experiencias ligadas al
      compartir. El Animador NO debe ser quien le dè una definición de
      compartir o "le explique" al niño/adolescente acerca de por qué es
      bueno compartir... ¡El niño y adolescente lo debe descubrir por si
      mismo y en comunidad a través de la experiencia de vida!`],
      ["Iluminación", ` Es otro de los tres grandes momentos del encuentro en el que, aqui, la
      Palabra es protagonista. Escuchamos y damos lugar a lo que Jesús nos
      quiere contar, decir, transmitir con respecto a lo experimentado
      anteriormente; por eso se le llama "iluminación", porque la Palabra da
      luz a la experiencia de vida, a esa realidad traída al encuentro.
      ¡Importante! Nunca se debe suprimir este momento, ya que en los pasos
      de la metodología de la IAM la Palabra tiene un lugar privilegiado
      para que, precisamente, los niños y adolescentes se encuentren con
      Jesús. Es necesario adecuar la extensión y complejidad de la cita a
      trabajar según la edad y el proceso de los niños/adolescentes (en
      NINGÚN CASO se debe adaptar la Palabra de modo de "hacerle decir a la
      Palabra cosas que no dice"; Sí se puede buscar entre las traducciones
      de la Biblia aquella que utilice expresiones más propias para los
      niños/adolescentes -Ejemplo: Genera más cercanía una cita que dice
      "Ustedes son mis amigos que otra que dice "vosotros sois mis amigos").
      Si los niños son muy pequeños y la cita es muy extensa (por ejemplo,
      las parábolas), es posible acompañar la proclamación de la Palabra con
      imágenes, representaciones teatrales, etcétera (pero en ningún momento
      se debe suprimir la lectura de la Palabra para ser reemplazada por
      otro recurso).`],
      ["Dinámica / Actividad", `A veces los animadores creemos que debemos "enseñarles, explicarles"
      todo a los niños y adolescentes; eso nos ubica en un rol de
      superioridad pero, como hemos visto anteriormente, en este proceso
      estamos todos juntos. En realidad, los animadores acompañamos el
      proceso de encuentro, generamos puentes. Este momento busca que sea un
      tiempo en el cual los niños/adolescentes reflexionen, mediante
      dinámicas o actividades, lo que les fue dado en la Palabra y lo traido
      en la experiencia de vida. Es la vinculación, a través de un juego,
      dinámica, actividad, canción, etc, entre la experiencia de vida y la
      iluminación. Si la propuesta de la experiencia de vida es clara y la
      lectura elegida de la Palabra es pertinente, la asociación, la
      relación, "el mensaje" que se quiere compartir en el encuentro (que
      está evidenciado en los objetivos planteados) debe salir naturalmente
      de los niños/adolescentes (si la experiencia de vida es sobre el
      compartir y la Palabra nos habla de compartir lo que tenemos con los
      demás, el mensaje "Jesús nos anima a compartir y compartimos con todos
      sale solo. La dinámica/actividad pretende reforzar ese mensaje).
      ¡ATENCIÓN! Como hemos explicado, cada encuentro, según el paso de la
      Escuela con Jesús en el que nos encontremos, tiene su especificidad en
      cuanto al objetivo y el propósito. Es en este momento en el que se
      evidencia esto: Si estamos en un encuentro de Catequesis Misionera, la
      dinámica/actividad debe procurar fijar lo aprendido, afianzar el
      "concepto", por decirlo de algún modo; en la Espiritualidad Misionera
      aquí, en este momento de dinámica/actividad, realizaremos la
      celebración, el momento de interiorización de lo vivido; en la
      Proyección Misionera, aqui "saldremos" a misionar, realizaremos el
      gesto misionero; en la Comunión Misionera, festejaremos, merendaremos,
      realizaremos una dinámica/actividad que nos vincule, nos encuentre
      como comunidad.`],
      ["Compromisos", `Es el tercer y último momento clave del Encuentro; a veces, como está
      planteado sobre el final del mismo, lo subestimamos o realizamos
      velozmente. Es fundamental dedicar el tiempo necesario a esta
      instancia que nos compromete y nos hace descubrir misioneros día a
      día, en nuestra realidad y en nuestra vida cotidiana. El compromiso
      misionero es asumido libremente por el niño, adolescente jy animador!
      Para crecer personal y comunitariamente en la misión; por lo tanto, es
      un compromiso del niño/adolescente/animador con Dios, no es un deber
      que el animador les da. Es un error que los animadores indiquen que
      deben hacer los niños y adolescentes ("Durante la semana vamos a..."),
      ya que cada niño/adolescente/animador es protagonista de su proceso y,
      por lo tanto, deben asumir sus propios compromisos para crecer. El
      propósito de los compromisos misioneros es llevar lo vivido en el
      encuentro a la vida cotidiana, al resto de la semana. El animador
      tiene como propósito acompañar y guiar a que los niños/adolescentes (y
      él mismo) pueda descubrir en qué se puede comprometer y que, el
      compromiso asumido, responda con lo trabajado en el encuentro. Por
      esta razón, el Cuaderno Misionero de cada uno de los
      niños/adolescentes será el espacio donde se anoten dichoscompromisos a
      fin de recordarlos". Hay tres tipos de compromisos misioneros (se
      introducirán gradualmente durante el año, respetando los procesos y
      garantizando que se vayan cumpliendo y afianzando en la vida del niño,
      adolescente y animador como hábito): Personales (un compromiso con
      Jesús para crecer personalmente en mi relación con Él y en la apertura
      a la vida desde la misión), Ambientales (compromisos para crecer en mi
      relación con mi ambiente, con quienes me relaciono habitualmente
      familia, compañeros del colegio, dub, vecinos, etcétera....), Más allá
      de las Fronteras (compromisos para unirme a quienes viven más allá de
      las fronteras, niños, adolescentes y misioneros de todo el mundo).`],
      ["Oración Final", `Es un tiempo de encuentro intimo y breve con Jesús, donde ponemos en
      manos de Él lo vivido en el encuentro, el compromiso asumido, damos
      gracias y pedimos que nos guie y acompañe en el ser misioneros. De
      este modo, se da por finalizado el encuentro. En muchas ocasiones, se
      suele aprovechar este espacio para rezar en comunidad el "Ave María
      por dia" propuesto por el Fundador de la Obra. Los animadores, atentos
      a la realidad de sus comunidades y a la duración de cada encuentro
      semanal, dosificará la duración de cada momento pero, como se
      estableció, no puede obviar ni suprimir ninguno de ellos (tampoco debe
      alterar el orden establecido)`]
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className=" mx-auto p-8 space-y-12 bg-gradient-to-b from-white via-yellow-50 to-yellow-200 shadow-lg mt-8"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-extrabold text-yellow-500 mb-6 text-center drop-shadow-lg"
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
            className="border-2 border-yellow-200 rounded-2xl overflow-hidden shadow-md bg-white p-5 group open:shadow-lg"
          >
            <summary className="font-semibold text-gray-700 text-xl cursor-pointer group-hover:text-yellow-400 transition-all">
              {titulo}
            </summary>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-gray-700 text-[17px] leading-relaxed"
            >
              {contenido}
            </motion.p>
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
