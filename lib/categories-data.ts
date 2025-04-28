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
    ],
  },
  {
    slug: "bebidas-hidratantes",
    title: "Bebidas Hidratantes",
    description: "Bebidas para mantenerte hidratado durante todo el día",
    image: "/placeholder.svg?height=400&width=1200&query=hydrating+drinks+banner",
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
