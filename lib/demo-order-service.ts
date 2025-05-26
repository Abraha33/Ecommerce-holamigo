export interface DemoOrder {
  id: string
  orderNumber: string
  date: string
  status: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
    variant?: string
  }>
  total: number
  subtotal: number
  shipping: number
  discount: number
  deliveryAddress: {
    street: string
    city: string
    state: string
    country: string
  }
  paymentMethod: string
  deliveryType: string
  estimatedDelivery: string
}

export const createDemoOrder = (): DemoOrder => {
  return {
    id: `ORD-${Date.now()}`,
    orderNumber: Math.floor(Math.random() * 90000000 + 10000000).toString(),
    date: new Date().toISOString(),
    status: "En camino",
    items: [
      {
        id: "demo-1",
        name: "Contenedor Ecológico 500ml",
        price: 12500,
        quantity: 1,
        image: "/open-eco-container.png",
      },
      {
        id: "demo-2",
        name: "Set de Vasos Biodegradables",
        price: 18000,
        quantity: 1,
        image: "/colorful-plastic-cups.png",
      },
    ],
    total: 30500,
    subtotal: 30500,
    shipping: 0,
    discount: 440,
    deliveryAddress: {
      street: "KR 35 A # 45 - 25 CABECERA DEL LLANO",
      city: "BUCARAMANGA",
      state: "SANTANDER",
      country: "COLOMBIA",
    },
    paymentMethod: "Efectivo",
    deliveryType: "Express",
    estimatedDelivery: "15 min",
  }
}

export const saveDemoOrder = (order: DemoOrder) => {
  localStorage.setItem("latestOrder", JSON.stringify(order))
  localStorage.setItem("demoOrderCreated", "true")
}

export const getDemoOrder = (): DemoOrder | null => {
  try {
    const saved = localStorage.getItem("latestOrder")
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

export const hasDemoOrder = (): boolean => {
  return localStorage.getItem("demoOrderCreated") === "true"
}
