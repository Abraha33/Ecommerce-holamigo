export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Política de Cookies</h1>

      <div className="prose prose-lg max-w-none">
        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-4">¿Qué son las cookies?</h2>
        <p>
          Una cookie es un pequeño archivo que se descarga en su dispositivo al acceder a determinadas páginas web. Las
          cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de
          navegación del usuario o de su equipo. Dependiendo de la información que contengan y de cómo se utilice el
          dispositivo, pueden emplearse para reconocer al usuario.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-4">¿Para qué se usan?</h2>
        <p>
          El navegador del usuario almacena cookies en su disco duro durante la sesión actual, ocupando un espacio
          mínimo de memoria y sin dañar el dispositivo. Estas cookies no suelen contener información personal específica
          y, en su mayoría, se eliminan automáticamente al cerrar el navegador (cookies de sesión).
        </p>
        <p>
          La mayoría de los navegadores aceptan cookies por defecto y permiten, en sus ajustes de seguridad, permitir o
          bloquear cookies temporales o persistentes.
        </p>
        <p>
          Sin su consentimiento expreso —mediante la activación de cookies en su navegador— este sitio web no vinculará
          los datos almacenados en las cookies con sus datos personales proporcionados durante el registro o la compra.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-4">Tipos de cookies que utilizamos</h2>

        <h3 className="text-lg font-medium text-blue-500 mt-6 mb-3">1. Cookies técnicas</h3>
        <p>
          Permiten la navegación en la web y el uso de sus funcionalidades básicas: control del tráfico, identificación
          de sesión, acceso a áreas restringidas, realización de compras, uso de elementos de seguridad, entre otros.
        </p>

        <h3 className="text-lg font-medium text-blue-500 mt-6 mb-3">2. Cookies de personalización</h3>
        <p>
          Permiten al usuario acceder con características predefinidas como el idioma, tipo de navegador, configuración
          regional, etc.
        </p>

        <h3 className="text-lg font-medium text-blue-500 mt-6 mb-3">3. Cookies de análisis</h3>
        <p>
          Nos permiten cuantificar el número de usuarios y analizar estadísticamente el uso del sitio, con el fin de
          mejorar nuestra oferta de productos y servicios.
        </p>

        <h3 className="text-lg font-medium text-blue-500 mt-6 mb-3">4. Cookies publicitarias</h3>
        <p>
          Gestionan de forma eficaz los espacios publicitarios del sitio web, adaptando el contenido del anuncio al
          perfil del usuario.
        </p>

        <h3 className="text-lg font-medium text-blue-500 mt-6 mb-3">5. Cookies de publicidad comportamental</h3>
        <p>
          Almacenan información del comportamiento del usuario mediante la observación continua de sus hábitos de
          navegación. Esto permite crear un perfil y mostrar publicidad personalizada.
        </p>

        <h3 className="text-lg font-medium text-blue-500 mt-6 mb-3">6. Cookies de terceros</h3>
        <p>
          Este sitio puede utilizar servicios de terceros —como Google Analytics— que recopilan información con fines
          estadísticos y de análisis de uso del sitio. Google Analytics es un servicio de análisis web proporcionado por
          Google Inc., con sede en 1600 Amphitheatre Parkway, Mountain View, California 94043, EE.UU.
        </p>
        <p>
          Google puede compartir esta información con terceros por razones legales o si estos procesan los datos en
          nombre de Google. Al utilizar este sitio, usted acepta el tratamiento de esta información por parte de Google
          en los términos descritos.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-4">¿Cómo gestionar las cookies?</h2>
        <p>
          Puede permitir, bloquear o eliminar las cookies instaladas en su dispositivo mediante la configuración del
          navegador que utilice. A continuación, le proporcionamos enlaces a los métodos de configuración de cookies de
          los navegadores más populares:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Microsoft Edge / Internet Explorer
            </a>
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-blue-600 mt-8 mb-4">Contacto</h2>
        <p>
          Si tiene alguna duda sobre esta política de cookies, puede ponerse en contacto con el responsable en la
          siguiente dirección de correo electrónico:
        </p>
        <p className="font-medium">📩 envax.santander@gmail.com</p>
      </div>
    </div>
  )
}
