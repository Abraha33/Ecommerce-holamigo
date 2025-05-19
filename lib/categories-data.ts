// Estructura de datos para categorías, subcategorías y subcategorías anidadas
export interface NestedSubcategory {
  slug: string
  title: string
  description: string
  image?: string
}

export interface Subcategory {
  slug: string
  title: string
  description: string
  image?: string
  nestedSubcategories?: NestedSubcategory[]
}

export interface Category {
  slug: string
  title: string
  description: string
  image: string
  subcategories?: Subcategory[]
}

// Datos de ejemplo para las categorías y subcategorías
export const categoriesData: Category[] = [
  {
    slug: "insuperables",
    title: "Insuperables",
    description: "Productos con precios insuperables para tu hogar y negocio",
    image: "/inspiring-mountain-vista.png",
    subcategories: [
      {
        slug: "ofertas-semanales",
        title: "Ofertas Semanales",
        description: "Las mejores ofertas de la semana con descuentos increíbles",
        image: "/subcategories/ofertas-semanales.png",
        nestedSubcategories: [
          {
            slug: "2x1",
            title: "Promociones 2x1",
            description: "Lleva dos productos por el precio de uno",
          },
          {
            slug: "descuentos-50",
            title: "Descuentos hasta 50%",
            description: "Productos con descuentos de hasta el 50%",
          },
        ],
      },
      {
        slug: "liquidacion",
        title: "Liquidación",
        description: "Productos en liquidación con precios increíbles",
        image: "/subcategories/liquidacion.png",
      },
      {
        slug: "super-ahorro",
        title: "Super Ahorro",
        description: "Los mejores precios garantizados",
        image: "/super-ahorro.png",
      },
      {
        slug: "combos-especiales",
        title: "Combos Especiales",
        description: "Paquetes con productos seleccionados a precios especiales",
        image: "/special-combos.png",
      },
      {
        slug: "descuentos-flash",
        title: "Descuentos Flash",
        description: "Ofertas relámpago por tiempo limitado",
        image: "/descuentos-flash.png",
      },
      {
        slug: "ultimas-unidades",
        title: "Últimas Unidades",
        description: "Aprovecha las últimas unidades disponibles",
        image: "/subcategories/ultimas-unidades.png",
      },
      {
        slug: "recien-llegados",
        title: "Recién Llegados",
        description: "Nuevos productos con precios de lanzamiento",
        image: "/placeholder.svg?height=200&width=200&query=nuevos%20productos",
      },
      {
        slug: "pague-1-lleve-2",
        title: "Pague 1 Lleve 2",
        description: "Promociones especiales de pague uno y lleve dos",
        image: "/placeholder.svg?height=200&width=200&query=pague%20uno%20lleve%20dos",
      },
      {
        slug: "descuentos-temporada",
        title: "Descuentos de Temporada",
        description: "Aprovecha los descuentos de temporada",
        image: "/placeholder.svg?height=200&width=200&query=descuentos%20temporada",
      },
      {
        slug: "segunda-unidad",
        title: "Segunda Unidad a Mitad de Precio",
        description: "Compra dos y paga la segunda a mitad de precio",
        image: "/placeholder.svg?height=200&width=200&query=segunda%20unidad%20mitad%20precio",
      },
      {
        slug: "pack-ahorro",
        title: "Pack Ahorro",
        description: "Paquetes de productos con descuentos especiales",
        image: "/placeholder.svg?height=200&width=200&query=pack%20ahorro",
      },
      {
        slug: "outlet-digital",
        title: "Outlet Digital",
        description: "Productos con descuentos exclusivos online",
        image: "/placeholder.svg?height=200&width=200&query=outlet%20digital",
      },
      {
        slug: "promocion-exclusiva",
        title: "Promoción Exclusiva",
        description: "Ofertas exclusivas para clientes registrados",
        image: "/placeholder.svg?height=200&width=200&query=promocion%20exclusiva",
      },
      {
        slug: "compra-mayorista",
        title: "Compra Mayorista",
        description: "Precios especiales para compras al por mayor",
        image: "/placeholder.svg?height=200&width=200&query=compra%20mayorista",
      },
    ],
  },
  {
    slug: "oferta-estrella",
    title: "Oferta Estrella",
    description: "Las mejores ofertas con descuentos increíbles",
    image: "/vibrant-sale-burst.png",
    subcategories: [
      {
        slug: "ofertas-del-dia",
        title: "Ofertas del Día",
        description: "Ofertas especiales que cambian cada día",
        image: "/subcategories/ofertas-del-dia.png",
      },
      {
        slug: "ultimas-unidades",
        title: "Últimas Unidades",
        description: "Aprovecha las últimas unidades disponibles",
        image: "/subcategories/ultimas-unidades.png",
      },
      {
        slug: "descuentos-exclusivos",
        title: "Descuentos Exclusivos",
        description: "Descuentos exclusivos para clientes frecuentes",
        image: "/placeholder.svg?height=200&width=200&query=descuentos%20exclusivos",
      },
      {
        slug: "ofertas-fin-semana",
        title: "Ofertas de Fin de Semana",
        description: "Descuentos especiales solo los fines de semana",
        image: "/placeholder.svg?height=200&width=200&query=ofertas%20fin%20semana",
      },
      {
        slug: "promociones-especiales",
        title: "Promociones Especiales",
        description: "Promociones por tiempo limitado",
        image: "/placeholder.svg?height=200&width=200&query=promociones%20especiales",
      },
      {
        slug: "descuentos-cumpleanos",
        title: "Descuentos de Cumpleaños",
        description: "Ofertas especiales en el mes de tu cumpleaños",
        image: "/placeholder.svg?height=200&width=200&query=descuentos%20cumpleanos",
      },
      {
        slug: "ofertas-relampago",
        title: "Ofertas Relámpago",
        description: "Descuentos por tiempo muy limitado",
        image: "/placeholder.svg?height=200&width=200&query=ofertas%20relampago",
      },
      {
        slug: "descuentos-primera-compra",
        title: "Descuentos Primera Compra",
        description: "Ofertas especiales para tu primera compra",
        image: "/placeholder.svg?height=200&width=200&query=primera%20compra",
      },
      {
        slug: "ofertas-app",
        title: "Ofertas App",
        description: "Descuentos exclusivos para usuarios de la app",
        image: "/placeholder.svg?height=200&width=200&query=ofertas%20app",
      },
      {
        slug: "descuentos-membresia",
        title: "Descuentos Membresía",
        description: "Ofertas exclusivas para miembros premium",
        image: "/placeholder.svg?height=200&width=200&query=descuentos%20membresia",
      },
      {
        slug: "ofertas-aniversario",
        title: "Ofertas Aniversario",
        description: "Descuentos especiales por nuestro aniversario",
        image: "/placeholder.svg?height=200&width=200&query=ofertas%20aniversario",
      },
      {
        slug: "descuentos-temporada",
        title: "Descuentos de Temporada",
        description: "Ofertas especiales de temporada",
        image: "/placeholder.svg?height=200&width=200&query=descuentos%20temporada",
      },
      {
        slug: "ofertas-clearance",
        title: "Ofertas Clearance",
        description: "Últimas unidades a precios increíbles",
        image: "/placeholder.svg?height=200&width=200&query=ofertas%20clearance",
      },
      {
        slug: "descuentos-volumen",
        title: "Descuentos por Volumen",
        description: "Mayores descuentos a mayor cantidad",
        image: "/placeholder.svg?height=200&width=200&query=descuentos%20volumen",
      },
      {
        slug: "ofertas-fidelidad",
        title: "Ofertas Fidelidad",
        description: "Descuentos para clientes frecuentes",
        image: "/placeholder.svg?height=200&width=200&query=ofertas%20fidelidad",
      },
    ],
  },
  {
    slug: "lacteos",
    title: "Lácteos",
    description: "Productos lácteos frescos y de alta calidad",
    image: "/fresh-dairy-display.png",
    subcategories: [
      {
        slug: "leche",
        title: "Leche",
        description: "Diferentes tipos de leche para toda la familia",
        image: "/subcategories/leche.png",
        nestedSubcategories: [
          {
            slug: "entera",
            title: "Leche Entera",
            description: "Leche entera de la mejor calidad",
          },
          {
            slug: "deslactosada",
            title: "Leche Deslactosada",
            description: "Leche sin lactosa para personas intolerantes",
          },
          {
            slug: "descremada",
            title: "Leche Descremada",
            description: "Leche con bajo contenido de grasa",
          },
        ],
      },
      {
        slug: "yogurt",
        title: "Yogurt",
        description: "Yogures de diferentes sabores y presentaciones",
        image: "/subcategories/yogurt.png",
      },
      {
        slug: "quesos",
        title: "Quesos",
        description: "Variedad de quesos nacionales e importados",
        image: "/subcategories/quesos.png",
        nestedSubcategories: [
          {
            slug: "frescos",
            title: "Quesos Frescos",
            description: "Quesos frescos y cremosos",
          },
          {
            slug: "madurados",
            title: "Quesos Madurados",
            description: "Quesos madurados con sabor intenso",
          },
        ],
      },
      {
        slug: "leches-vegetales",
        title: "Leches Vegetales",
        description: "Alternativas a la leche de vaca",
        image: "/placeholder.svg?height=200&width=200&query=leches%20vegetales",
      },
      {
        slug: "mantequillas",
        title: "Mantequillas",
        description: "Mantequillas con y sin sal",
        image: "/placeholder.svg?height=200&width=200&query=mantequillas",
      },
      {
        slug: "cremas",
        title: "Cremas",
        description: "Cremas de leche y vegetales",
        image: "/placeholder.svg?height=200&width=200&query=cremas",
      },
      {
        slug: "postres-lacteos",
        title: "Postres Lácteos",
        description: "Variedad de postres con base láctea",
        image: "/placeholder.svg?height=200&width=200&query=postres%20lacteos",
      },
      {
        slug: "helados",
        title: "Helados",
        description: "Helados de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=helados",
      },
      {
        slug: "dulce-de-leche",
        title: "Dulce de Leche",
        description: "Dulce tradicional a base de leche",
        image: "/placeholder.svg?height=200&width=200&query=dulce%20de%20leche",
      },
      {
        slug: "quesos-untables",
        title: "Quesos Untables",
        description: "Quesos cremosos para untar",
        image: "/placeholder.svg?height=200&width=200&query=quesos%20untables",
      },
      {
        slug: "bebidas-lacteas",
        title: "Bebidas Lácteas",
        description: "Bebidas a base de leche y frutas",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20lacteas",
      },
      {
        slug: "leche-condensada",
        title: "Leche Condensada",
        description: "Leche condensada azucarada",
        image: "/placeholder.svg?height=200&width=200&query=leche%20condensada",
      },
      {
        slug: "nata",
        title: "Nata",
        description: "Nata para montar y cocinar",
        image: "/placeholder.svg?height=200&width=200&query=nata",
      },
      {
        slug: "requeson",
        title: "Requesón",
        description: "Queso fresco y ligero",
        image: "/placeholder.svg?height=200&width=200&query=requeson",
      },
      {
        slug: "cuajada",
        title: "Cuajada",
        description: "Postre lácteo tradicional",
        image: "/placeholder.svg?height=200&width=200&query=cuajada",
      },
    ],
  },
  {
    slug: "aseo",
    title: "Aseo",
    description: "Productos de limpieza y aseo para tu hogar",
    image: "/sparkling-clean-banner.png",
    subcategories: [
      {
        slug: "limpieza-hogar",
        title: "Limpieza del Hogar",
        description: "Productos para la limpieza de tu hogar",
        image: "/subcategories/limpieza-hogar.png",
      },
      {
        slug: "cuidado-personal",
        title: "Cuidado Personal",
        description: "Productos para el cuidado personal",
        image: "/subcategories/cuidado-personal.png",
      },
      {
        slug: "detergentes",
        title: "Detergentes",
        description: "Detergentes para ropa y lavavajillas",
        image: "/placeholder.svg?height=200&width=200&query=detergentes",
      },
      {
        slug: "suavizantes",
        title: "Suavizantes",
        description: "Suavizantes para ropa",
        image: "/placeholder.svg?height=200&width=200&query=suavizantes",
      },
      {
        slug: "lejias",
        title: "Lejías",
        description: "Lejías y blanqueadores",
        image: "/placeholder.svg?height=200&width=200&query=lejias",
      },
      {
        slug: "limpiadores-multiusos",
        title: "Limpiadores Multiusos",
        description: "Limpiadores para diferentes superficies",
        image: "/placeholder.svg?height=200&width=200&query=limpiadores%20multiusos",
      },
      {
        slug: "friegasuelos",
        title: "Friegasuelos",
        description: "Friegasuelos para todo tipo de suelos",
        image: "/placeholder.svg?height=200&width=200&query=friegasuelos",
      },
      {
        slug: "desinfectantes",
        title: "Desinfectantes",
        description: "Desinfectantes para el hogar",
        image: "/placeholder.svg?height=200&width=200&query=desinfectantes",
      },
      {
        slug: "ambientadores",
        title: "Ambientadores",
        description: "Ambientadores para el hogar",
        image: "/placeholder.svg?height=200&width=200&query=ambientadores",
      },
      {
        slug: "insecticidas",
        title: "Insecticidas",
        description: "Insecticidas para el hogar",
        image: "/placeholder.svg?height=200&width=200&query=insecticidas",
      },
      {
        slug: "papel-higienico",
        title: "Papel Higiénico",
        description: "Papel higiénico de diferentes capas",
        image: "/placeholder.svg?height=200&width=200&query=papel%20higienico",
      },
      {
        slug: "toallas-papel",
        title: "Toallas de Papel",
        description: "Toallas de papel para la cocina",
        image: "/placeholder.svg?height=200&width=200&query=toallas%20papel",
      },
      {
        slug: "servilletas",
        title: "Servilletas",
        description: "Servilletas de papel y tela",
        image: "/placeholder.svg?height=200&width=200&query=servilletas",
      },
      {
        slug: "bolsas-basura",
        title: "Bolsas de Basura",
        description: "Bolsas de basura de diferentes tamaños",
        image: "/placeholder.svg?height=200&width=200&query=bolsas%20basura",
      },
      {
        slug: "guantes",
        title: "Guantes",
        description: "Guantes para la limpieza",
        image: "/placeholder.svg?height=200&width=200&query=guantes",
      },
    ],
  },
  {
    slug: "licores",
    title: "Licores",
    description: "Bebidas alcohólicas y licores premium",
    image: "/diverse-spirits-celebration.png",
    subcategories: [
      {
        slug: "vinos",
        title: "Vinos",
        description: "Vinos nacionales e importados",
        image: "/subcategories/vinos.png",
        nestedSubcategories: [
          {
            slug: "tintos",
            title: "Vinos Tintos",
            description: "Vinos tintos de diferentes regiones",
          },
          {
            slug: "blancos",
            title: "Vinos Blancos",
            description: "Vinos blancos frescos y aromáticos",
          },
          {
            slug: "espumosos",
            title: "Vinos Espumosos",
            description: "Champagne y vinos espumosos",
          },
        ],
      },
      {
        slug: "cervezas",
        title: "Cervezas",
        description: "Cervezas artesanales e industriales",
        image: "/subcategories/cervezas.png",
      },
      {
        slug: "destilados",
        title: "Destilados",
        description: "Whisky, ron, vodka y más",
        image: "/subcategories/destilados.png",
      },
      {
        slug: "whiskies",
        title: "Whiskies",
        description: "Whiskies de malta y blended",
        image: "/placeholder.svg?height=200&width=200&query=whiskies",
      },
      {
        slug: "rones",
        title: "Rones",
        description: "Rones añejos y blancos",
        image: "/placeholder.svg?height=200&width=200&query=rones",
      },
      {
        slug: "vodkas",
        title: "Vodkas",
        description: "Vodkas de diferentes orígenes",
        image: "/placeholder.svg?height=200&width=200&query=vodkas",
      },
      {
        slug: "ginebras",
        title: "Ginebras",
        description: "Ginebras secas y aromáticas",
        image: "/placeholder.svg?height=200&width=200&query=ginebras",
      },
      {
        slug: "tequilas",
        title: "Tequilas",
        description: "Tequilas blancos y reposados",
        image: "/placeholder.svg?height=200&width=200&query=tequilas",
      },
      {
        slug: "brandies",
        title: "Brandies",
        description: "Brandies españoles y franceses",
        image: "/placeholder.svg?height=200&width=200&query=brandies",
      },
      {
        slug: "licores-cremosos",
        title: "Licores Cremosos",
        description: "Licores cremosos de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=licores%20cremosos",
      },
      {
        slug: "aperitivos",
        title: "Aperitivos",
        description: "Aperitivos para antes de las comidas",
        image: "/placeholder.svg?height=200&width=200&query=aperitivos",
      },
      {
        slug: "digestivos",
        title: "Digestivos",
        description: "Digestivos para después de las comidas",
        image: "/placeholder.svg?height=200&width=200&query=digestivos",
      },
      {
        slug: "cavas",
        title: "Cavas",
        description: "Cavas catalanes",
        image: "/placeholder.svg?height=200&width=200&query=cavas",
      },
      {
        slug: "champagnes",
        title: "Champagnes",
        description: "Champagnes franceses",
        image: "/placeholder.svg?height=200&width=200&query=champagnes",
      },
      {
        slug: "sidras",
        title: "Sidras",
        description: "Sidras naturales y espumosas",
        image: "/placeholder.svg?height=200&width=200&query=sidras",
      },
    ],
  },
  {
    slug: "cosmeticos",
    title: "Cosméticos",
    description: "Productos de belleza y cuidado personal",
    image: "/radiant-beauty-banner.png",
    subcategories: [
      {
        slug: "maquillaje",
        title: "Maquillaje",
        description: "Productos de maquillaje para rostro, ojos y labios",
        image: "/subcategories/maquillaje.png",
      },
      {
        slug: "cuidado-piel",
        title: "Cuidado de la Piel",
        description: "Productos para el cuidado de la piel",
        image: "/subcategories/cuidado-piel.png",
      },
      {
        slug: "cuidado-cabello",
        title: "Cuidado del Cabello",
        description: "Productos para el cuidado del cabello",
        image: "/placeholder.svg?height=200&width=200&query=cuidado%20cabello",
      },
      {
        slug: "perfumes",
        title: "Perfumes",
        description: "Perfumes para hombre y mujer",
        image: "/placeholder.svg?height=200&width=200&query=perfumes",
      },
      {
        slug: "colonias",
        title: "Colonias",
        description: "Colonias frescas y ligeras",
        image: "/placeholder.svg?height=200&width=200&query=colonias",
      },
      {
        slug: "cosmetica-natural",
        title: "Cosmética Natural",
        description: "Productos de cosmética natural y orgánica",
        image: "/placeholder.svg?height=200&width=200&query=cosmetica%20natural",
      },
      {
        slug: "maquillaje-ojos",
        title: "Maquillaje de Ojos",
        description: "Sombras, delineadores y máscaras de pestañas",
        image: "/placeholder.svg?height=200&width=200&query=maquillaje%20ojos",
      },
      {
        slug: "maquillaje-rostro",
        title: "Maquillaje de Rostro",
        description: "Bases, correctores y polvos",
        image: "/placeholder.svg?height=200&width=200&query=maquillaje%20rostro",
      },
      {
        slug: "maquillaje-labios",
        title: "Maquillaje de Labios",
        description: "Labiales, brillos y delineadores de labios",
        image: "/placeholder.svg?height=200&width=200&query=maquillaje%20labios",
      },
      {
        slug: "accesorios-maquillaje",
        title: "Accesorios de Maquillaje",
        description: "Brochas, esponjas y pinceles",
        image: "/placeholder.svg?height=200&width=200&query=accesorios%20maquillaje",
      },
      {
        slug: "tratamientos-faciales",
        title: "Tratamientos Faciales",
        description: "Mascarillas, serums y cremas faciales",
        image: "/placeholder.svg?height=200&width=200&query=tratamientos%20faciales",
      },
      {
        slug: "protectores-solares",
        title: "Protectores Solares",
        description: "Protectores solares para rostro y cuerpo",
        image: "/placeholder.svg?height=200&width=200&query=protectores%20solares",
      },
      {
        slug: "autobronceadores",
        title: "Autobronceadores",
        description: "Autobronceadores para un bronceado sin sol",
        image: "/placeholder.svg?height=200&width=200&query=autobronceadores",
      },
      {
        slug: "depilacion",
        title: "Depilación",
        description: "Productos para la depilación",
        image: "/placeholder.svg?height=200&width=200&query=depilacion",
      },
      {
        slug: "higiene-bucal",
        title: "Higiene Bucal",
        description: "Productos para la higiene bucal",
        image: "/placeholder.svg?height=200&width=200&query=higiene%20bucal",
      },
    ],
  },
  {
    slug: "bebidas",
    title: "Bebidas",
    description: "Refrescos, jugos y bebidas para toda ocasión",
    image: "/refreshing-drinks-banner.png",
    subcategories: [
      {
        slug: "gaseosas",
        title: "Gaseosas",
        description: "Refrescos y bebidas carbonatadas",
        image: "/subcategories/gaseosas.png",
      },
      {
        slug: "jugos",
        title: "Jugos",
        description: "Jugos naturales y néctares",
        image: "/subcategories/jugos.png",
      },
      {
        slug: "agua",
        title: "Agua",
        description: "Agua mineral y purificada",
        image: "/subcategories/agua.png",
      },
      {
        slug: "aguas-saborizadas",
        title: "Aguas Saborizadas",
        description: "Aguas con sabores naturales",
        image: "/placeholder.svg?height=200&width=200&query=aguas%20saborizadas",
      },
      {
        slug: "bebidas-isotonicas",
        title: "Bebidas Isotónicas",
        description: "Bebidas para deportistas",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20isotonicas",
      },
      {
        slug: "bebidas-energeticas",
        title: "Bebidas Energéticas",
        description: "Bebidas para aumentar la energía",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20energeticas",
      },
      {
        slug: "tes",
        title: "Tés",
        description: "Tés de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=tes",
      },
      {
        slug: "cafes",
        title: "Cafés",
        description: "Cafés de diferentes orígenes",
        image: "/placeholder.svg?height=200&width=200&query=cafes",
      },
      {
        slug: "chocolates",
        title: "Chocolates",
        description: "Chocolates en polvo y líquidos",
        image: "/placeholder.svg?height=200&width=200&query=chocolates",
      },
      {
        slug: "bebidas-vegetales",
        title: "Bebidas Vegetales",
        description: "Bebidas a base de soja, almendras y arroz",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20vegetales",
      },
      {
        slug: "zumos-naturales",
        title: "Zumos Naturales",
        description: "Zumos de frutas y verduras",
        image: "/placeholder.svg?height=200&width=200&query=zumos%20naturales",
      },
      {
        slug: "refrescos-light",
        title: "Refrescos Light",
        description: "Refrescos sin azúcar",
        image: "/placeholder.svg?height=200&width=200&query=refrescos%20light",
      },
      {
        slug: "bebidas-vitaminadas",
        title: "Bebidas Vitaminadas",
        description: "Bebidas con vitaminas añadidas",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20vitaminadas",
      },
      {
        slug: "horchata",
        title: "Horchata",
        description: "Horchata de chufa",
        image: "/placeholder.svg?height=200&width=200&query=horchata",
      },
      {
        slug: "granizados",
        title: "Granizados",
        description: "Granizados de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=granizados",
      },
    ],
  },
  {
    slug: "frutas-verduras",
    title: "Frutas y Verduras",
    description: "Productos frescos directamente del campo",
    image: "/colorful-produce-banner.png",
    subcategories: [
      {
        slug: "frutas",
        title: "Frutas",
        description: "Frutas frescas de temporada",
        image: "/subcategories/frutas.png",
        nestedSubcategories: [
          {
            slug: "tropicales",
            title: "Frutas Tropicales",
            description: "Frutas tropicales frescas",
          },
          {
            slug: "citricos",
            title: "Cítricos",
            description: "Naranjas, limones, mandarinas y más",
          },
        ],
      },
      {
        slug: "verduras",
        title: "Verduras",
        description: "Verduras frescas y orgánicas",
        image: "/subcategories/verduras.png",
      },
      {
        slug: "verduras-hoja-verde",
        title: "Verduras de Hoja Verde",
        description: "Espinacas, lechugas y acelgas",
        image: "/placeholder.svg?height=200&width=200&query=verduras%20hoja%20verde",
      },
      {
        slug: "frutas-rojas",
        title: "Frutas Rojas",
        description: "Fresas, frambuesas y arándanos",
        image: "/placeholder.svg?height=200&width=200&query=frutas%20rojas",
      },
      {
        slug: "frutas-amarillas",
        title: "Frutas Amarillas",
        description: "Plátanos, mangos y piñas",
        image: "/placeholder.svg?height=200&width=200&query=frutas%20amarillas",
      },
      {
        slug: "verduras-raiz",
        title: "Verduras de Raíz",
        description: "Zanahorias, remolachas y rábanos",
        image: "/placeholder.svg?height=200&width=200&query=verduras%20raiz",
      },
      {
        slug: "legumbres-frescas",
        title: "Legumbres Frescas",
        description: "Guisantes, habas y judías verdes",
        image: "/placeholder.svg?height=200&width=200&query=legumbres%20frescas",
      },
      {
        slug: "hierbas-aromaticas",
        title: "Hierbas Aromáticas",
        description: "Perejil, cilantro y albahaca",
        image: "/placeholder.svg?height=200&width=200&query=hierbas%20aromaticas",
      },
      {
        slug: "setas",
        title: "Setas",
        description: "Setas frescas de temporada",
        image: "/placeholder.svg?height=200&width=200&query=setas",
      },
      {
        slug: "frutos-secos-frescos",
        title: "Frutos Secos Frescos",
        description: "Almendras, nueces y avellanas",
        image: "/placeholder.svg?height=200&width=200&query=frutos%20secos%20frescos",
      },
      {
        slug: "verduras-congeladas",
        title: "Verduras Congeladas",
        description: "Verduras congeladas para conservar",
        image: "/placeholder.svg?height=200&width=200&query=verduras%20congeladas",
      },
      {
        slug: "frutas-congeladas",
        title: "Frutas Congeladas",
        description: "Frutas congeladas para batidos",
        image: "/placeholder.svg?height=200&width=200&query=frutas%20congeladas",
      },
      {
        slug: "ensaladas-preparadas",
        title: "Ensaladas Preparadas",
        description: "Ensaladas listas para consumir",
        image: "/placeholder.svg?height=200&width=200&query=ensaladas%20preparadas",
      },
      {
        slug: "brotes-verdes",
        title: "Brotes Verdes",
        description: "Brotes tiernos para ensaladas",
        image: "/placeholder.svg?height=200&width=200&query=brotes%20verdes",
      },
      {
        slug: "verduras-asadas",
        title: "Verduras Asadas",
        description: "Verduras asadas listas para comer",
        image: "/placeholder.svg?height=200&width=200&query=verduras%20asadas",
      },
    ],
  },
  {
    slug: "carnes",
    title: "Carnes",
    description: "Carnes frescas y de alta calidad",
    image: "/assorted-meats-display.png",
    subcategories: [
      {
        slug: "res",
        title: "Carne de Res",
        description: "Cortes de carne de res de primera calidad",
        image: "/subcategories/res.png",
      },
      {
        slug: "cerdo",
        title: "Carne de Cerdo",
        description: "Cortes de carne de cerdo frescos",
        image: "/subcategories/cerdo.png",
      },
      {
        slug: "pollo",
        title: "Pollo",
        description: "Pollo fresco y sus derivados",
        image: "/subcategories/pollo.png",
      },
      {
        slug: "ternera",
        title: "Ternera",
        description: "Carne de ternera de primera calidad",
        image: "/placeholder.svg?height=200&width=200&query=ternera",
      },
      {
        slug: "cordero",
        title: "Cordero",
        description: "Carne de cordero fresca",
        image: "/placeholder.svg?height=200&width=200&query=cordero",
      },
      {
        slug: "pavo",
        title: "Pavo",
        description: "Carne de pavo fresca",
        image: "/placeholder.svg?height=200&width=200&query=pavo",
      },
      {
        slug: "conejo",
        title: "Conejo",
        description: "Carne de conejo fresca",
        image: "/placeholder.svg?height=200&width=200&query=conejo",
      },
      {
        slug: "pato",
        title: "Pato",
        description: "Carne de pato fresca",
        image: "/placeholder.svg?height=200&width=200&query=pato",
      },
      {
        slug: "codorniz",
        title: "Codorniz",
        description: "Carne de codorniz fresca",
        image: "/placeholder.svg?height=200&width=200&query=codorniz",
      },
      {
        slug: "embutidos-frescos",
        title: "Embutidos Frescos",
        description: "Salchichas, chorizos y morcillas",
        image: "/placeholder.svg?height=200&width=200&query=embutidos%20frescos",
      },
      {
        slug: "hamburguesas",
        title: "Hamburguesas",
        description: "Hamburguesas de carne de res, cerdo y pollo",
        image: "/placeholder.svg?height=200&width=200&query=hamburguesas",
      },
      {
        slug: "carne-picada",
        title: "Carne Picada",
        description: "Carne picada de res, cerdo y pollo",
        image: "/placeholder.svg?height=200&width=200&query=carne%20picada",
      },
      {
        slug: "brochetas",
        title: "Brochetas",
        description: "Brochetas de carne de res, cerdo y pollo",
        image: "/placeholder.svg?height=200&width=200&query=brochetas",
      },
      {
        slug: "albóndigas",
        title: "Albóndigas",
        description: "Albóndigas de carne de res, cerdo y pollo",
        image: "/placeholder.svg?height=200&width=200&query=albondigas",
      },
      {
        slug: "carne-preparada",
        title: "Carne Preparada",
        description: "Carne preparada para asar y hornear",
        image: "/placeholder.svg?height=200&width=200&query=carne%20preparada",
      },
    ],
  },
  {
    slug: "delicatessen",
    title: "Delicatessen",
    description: "Productos gourmet y delicatessen",
    image: "/artisanal-deli-banner.png",
    subcategories: [
      {
        slug: "embutidos",
        title: "Embutidos",
        description: "Jamones, salchichones y embutidos importados",
        image: "/subcategories/embutidos.png",
      },
      {
        slug: "conservas",
        title: "Conservas",
        description: "Conservas y encurtidos gourmet",
        image: "/subcategories/conservas.png",
      },
      {
        slug: "quesos-importados",
        title: "Quesos Importados",
        description: "Quesos de diferentes países",
        image: "/placeholder.svg?height=200&width=200&query=quesos%20importados",
      },
      {
        slug: "patés",
        title: "Patés",
        description: "Patés de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=pates",
      },
      {
        slug: "aceites-gourmet",
        title: "Aceites Gourmet",
        description: "Aceites de oliva virgen extra",
        image: "/placeholder.svg?height=200&width=200&query=aceites%20gourmet",
      },
      {
        slug: "vinagres-especiales",
        title: "Vinagres Especiales",
        description: "Vinagres balsámicos y de vino",
        image: "/placeholder.svg?height=200&width=200&query=vinagres%20especiales",
      },
      {
        slug: "salsas-gourmet",
        title: "Salsas Gourmet",
        description: "Salsas para acompañar carnes y pescados",
        image: "/placeholder.svg?height=200&width=200&query=salsas%20gourmet",
      },
      {
        slug: "especias-exoticas",
        title: "Especias Exóticas",
        description: "Especias de diferentes partes del mundo",
        image: "/placeholder.svg?height=200&width=200&query=especias%20exoticas",
      },
      {
        slug: "panes-artesanales",
        title: "Panes Artesanales",
        description: "Panes elaborados con masa madre",
        image: "/placeholder.svg?height=200&width=200&query=panes%20artesanales",
      },
      {
        slug: "dulces-gourmet",
        title: "Dulces Gourmet",
        description: "Dulces elaborados con ingredientes de alta calidad",
        image: "/placeholder.svg?height=200&width=200&query=dulces%20gourmet",
      },
      {
        slug: "chocolates-premium",
        title: "Chocolates Premium",
        description: "Chocolates con alto porcentaje de cacao",
        image: "/placeholder.svg?height=200&width=200&query=chocolates%20premium",
      },
      {
        slug: "cafes-especiales",
        title: "Cafés Especiales",
        description: "Cafés de diferentes orígenes y tuestes",
        image: "/placeholder.svg?height=200&width=200&query=cafes%20especiales",
      },
      {
        slug: "tes-importados",
        title: "Tés Importados",
        description: "Tés de diferentes partes del mundo",
        image: "/placeholder.svg?height=200&width=200&query=tes%20importados",
      },
      {
        slug: "aguas-minerales-premium",
        title: "Aguas Minerales Premium",
        description: "Aguas minerales de diferentes orígenes",
        image: "/placeholder.svg?height=200&width=200&query=aguas%20minerales%20premium",
      },
      {
        slug: "cervezas-artesanales",
        title: "Cervezas Artesanales",
        description: "Cervezas elaboradas con métodos tradicionales",
        image: "/placeholder.svg?height=200&width=200&query=cervezas%20artesanales",
      },
    ],
  },
  {
    slug: "snack",
    title: "Snack",
    description: "Aperitivos y snacks para cualquier momento",
    image: "/colorful-snacks-display.png",
    subcategories: [
      {
        slug: "papas",
        title: "Papas Fritas",
        description: "Papas fritas y chips de diferentes sabores",
        image: "/subcategories/papas.png",
      },
      {
        slug: "frutos-secos",
        title: "Frutos Secos",
        description: "Nueces, almendras, pistachos y más",
        image: "/subcategories/frutos-secos.png",
      },
      {
        slug: "galletas",
        title: "Galletas",
        description: "Galletas dulces y saladas",
        image: "/placeholder.svg?height=200&width=200&query=galletas",
      },
      {
        slug: "chocolatinas",
        title: "Chocolatinas",
        description: "Chocolatinas de diferentes marcas",
        image: "/placeholder.svg?height=200&width=200&query=chocolatinas",
      },
      {
        slug: "caramelos",
        title: "Caramelos",
        description: "Caramelos de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=caramelos",
      },
      {
        slug: "gominolas",
        title: "Gominolas",
        description: "Gominolas de diferentes formas y sabores",
        image: "/placeholder.svg?height=200&width=200&query=gominolas",
      },
      {
        slug: "palomitas",
        title: "Palomitas",
        description: "Palomitas de maíz para microondas",
        image: "/placeholder.svg?height=200&width=200&query=palomitas",
      },
      {
        slug: "tortillas-maiz",
        title: "Tortillas de Maíz",
        description: "Tortillas de maíz para nachos",
        image: "/placeholder.svg?height=200&width=200&query=tortillas%20maiz",
      },
      {
        slug: "dips",
        title: "Dips",
        description: "Dips para acompañar nachos y tortillas",
        image: "/placeholder.svg?height=200&width=200&query=dips",
      },
      {
        slug: "aceitunas",
        title: "Aceitunas",
        description: "Aceitunas rellenas y sin hueso",
        image: "/placeholder.svg?height=200&width=200&query=aceitunas",
      },
      {
        slug: "encurtidos",
        title: "Encurtidos",
        description: "Pepinillos, cebolletas y zanahorias en vinagre",
        image: "/placeholder.svg?height=200&width=200&query=encurtidos",
      },
      {
        slug: "snacks-saludables",
        title: "Snacks Saludables",
        description: "Snacks bajos en calorías y grasas",
        image: "/placeholder.svg?height=200&width=200&query=snacks%20saludables",
      },
      {
        slug: "barritas-energeticas",
        title: "Barritas Energéticas",
        description: "Barritas para deportistas",
        image: "/placeholder.svg?height=200&width=200&query=barritas%20energeticas",
      },
      {
        slug: "fruta-deshidratada",
        title: "Fruta Deshidratada",
        description: "Fruta deshidratada sin azúcares añadidos",
        image: "/placeholder.svg?height=200&width=200&query=fruta%20deshidratada",
      },
      {
        slug: "semillas",
        title: "Semillas",
        description: "Semillas de chía, lino y sésamo",
        image: "/placeholder.svg?height=200&width=200&query=semillas",
      },
    ],
  },
  {
    slug: "bebidas-hidratantes",
    title: "Bebidas Hidratantes",
    description: "Bebidas para mantenerte hidratado durante todo el día",
    image: "/hydrating-drinks-banner.png",
    subcategories: [
      {
        slug: "deportivas",
        title: "Bebidas Deportivas",
        description: "Bebidas isotónicas para deportistas",
        image: "/subcategories/deportivas.png",
      },
      {
        slug: "energizantes",
        title: "Energizantes",
        description: "Bebidas energizantes para mantenerte activo",
        image: "/subcategories/energizantes.png",
      },
      {
        slug: "agua-mineral",
        title: "Agua Mineral",
        description: "Agua mineral natural",
        image: "/placeholder.svg?height=200&width=200&query=agua%20mineral",
      },
      {
        slug: "agua-con-gas",
        title: "Agua con Gas",
        description: "Agua con gas natural",
        image: "/placeholder.svg?height=200&width=200&query=agua%20con%20gas",
      },
      {
        slug: "zumos-naturales",
        title: "Zumos Naturales",
        description: "Zumos de frutas naturales",
        image: "/placeholder.svg?height=200&width=200&query=zumos%20naturales",
      },
      {
        slug: "refrescos-sin-azucar",
        title: "Refrescos sin Azúcar",
        description: "Refrescos sin azúcar añadida",
        image: "/placeholder.svg?height=200&width=200&query=refrescos%20sin%20azucar",
      },
      {
        slug: "tes-frios",
        title: "Tés Fríos",
        description: "Tés fríos de diferentes sabores",
        image: "/placeholder.svg?height=200&width=200&query=tes%20frios",
      },
      {
        slug: "bebidas-vitaminadas",
        title: "Bebidas Vitaminadas",
        description: "Bebidas con vitaminas añadidas",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20vitaminadas",
      },
      {
        slug: "bebidas-aloe-vera",
        title: "Bebidas de Aloe Vera",
        description: "Bebidas con aloe vera",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20aloe%20vera",
      },
      {
        slug: "bebidas-coco",
        title: "Bebidas de Coco",
        description: "Agua de coco y bebidas con coco",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20coco",
      },
      {
        slug: "bebidas-isotonicas-light",
        title: "Bebidas Isotónicas Light",
        description: "Bebidas isotónicas bajas en calorías",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20isotonicas%20light",
      },
      {
        slug: "bebidas-proteinas",
        title: "Bebidas de Proteínas",
        description: "Bebidas con proteínas para deportistas",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20proteinas",
      },
      {
        slug: "bebidas-vegetales-frias",
        title: "Bebidas Vegetales Frías",
        description: "Bebidas vegetales frías de soja, almendras y arroz",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20vegetales%20frias",
      },
      {
        slug: "bebidas-detox",
        title: "Bebidas Detox",
        description: "Bebidas para desintoxicar el organismo",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20detox",
      },
      {
        slug: "bebidas-probioticas",
        title: "Bebidas Probióticas",
        description: "Bebidas con probióticos para la salud intestinal",
        image: "/placeholder.svg?height=200&width=200&query=bebidas%20probioticas",
      },
    ],
  },
]

// Función para encontrar una categoría por su slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return categoriesData.find((category) => category.slug === slug)
}

// Función para encontrar una subcategoría por su slug dentro de una categoría
export function getSubcategoryBySlug(categorySlug: string, subcategorySlug: string): Subcategory | undefined {
  const category = getCategoryBySlug(categorySlug)
  return category?.subcategories?.find((subcategory) => subcategory.slug === subcategorySlug)
}

// Función para encontrar una subcategoría anidada por su slug
export function getNestedSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string,
  nestedSubcategorySlug: string,
): NestedSubcategory | undefined {
  const subcategory = getSubcategoryBySlug(categorySlug, subcategorySlug)
  return subcategory?.nestedSubcategories?.find((nestedSubcategory) => nestedSubcategory.slug === nestedSubcategorySlug)
}
