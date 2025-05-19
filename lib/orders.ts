export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export type OrderItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
  unit?: string
  sku?: string
}

export type Order = {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  tax: number
  discount: number
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  statusHistory: {
    status: OrderStatus
    date: string
    description: string
  }[]
}

// Datos de ejemplo para mostrar en la interfaz
export const orders: Order[] = [
  {
    id: "ORD-2023-0001",
    date: "2023-04-15T10:30:00Z",
    status: "delivered",
    items: [
      {
        id: "item-1",
        productId: "prod-1",
        name: "Contenedor Ecológico 500ml",
        price: 12500,
        quantity: 2,
        image: "/open-eco-container.png",
      },
      {
        id: "item-2",
        productId: "prod-2",
        name: "Set de Vasos Biodegradables",
        price: 18000,
        quantity: 1,
        image: "/colorful-plastic-cups.png",
      },
    ],
    total: 43000,
    subtotal: 43000,
    shipping: 0,
    tax: 0,
    discount: 0,
    shippingAddress: {
      name: "Carlos Rodríguez",
      street: "Calle 45 #28-15",
      city: "Bogotá",
      state: "Cundinamarca",
      zip: "110231",
    },
    trackingNumber: "TRK-789456123",
    estimatedDelivery: "2023-04-18T00:00:00Z",
    statusHistory: [
      {
        status: "pending",
        date: "2023-04-15T10:30:00Z",
        description: "Pedido recibido",
      },
      {
        status: "processing",
        date: "2023-04-15T14:45:00Z",
        description: "Pedido en preparación",
      },
      {
        status: "shipped",
        date: "2023-04-16T09:20:00Z",
        description: "Pedido enviado",
      },
      {
        status: "delivered",
        date: "2023-04-18T11:15:00Z",
        description: "Pedido entregado",
      },
    ],
  },
  {
    id: "ORD-2023-0002",
    date: "2023-04-20T15:45:00Z",
    status: "shipped",
    items: [
      {
        id: "item-3",
        productId: "prod-3",
        name: "Macetas Biodegradables (Pack x6)",
        price: 22000,
        quantity: 1,
        image: "/garden-biodegradable-pots.png",
      },
    ],
    total: 22000,
    subtotal: 22000,
    shipping: 0,
    tax: 0,
    discount: 0,
    shippingAddress: {
      name: "Carlos Rodríguez",
      street: "Calle 45 #28-15",
      city: "Bogotá",
      state: "Cundinamarca",
      zip: "110231",
    },
    trackingNumber: "TRK-987654321",
    estimatedDelivery: "2023-04-24T00:00:00Z",
    statusHistory: [
      {
        status: "pending",
        date: "2023-04-20T15:45:00Z",
        description: "Pedido recibido",
      },
      {
        status: "processing",
        date: "2023-04-21T09:30:00Z",
        description: "Pedido en preparación",
      },
      {
        status: "shipped",
        date: "2023-04-22T11:20:00Z",
        description: "Pedido enviado",
      },
    ],
  },
  {
    id: "ORD-2023-0003",
    date: "2023-04-25T09:15:00Z",
    status: "processing",
    items: [
      {
        id: "item-4",
        productId: "prod-4",
        name: "Contenedores Apilables (Set x3)",
        price: 35000,
        quantity: 1,
        image: "/stacked-eco-containers.png",
      },
      {
        id: "item-5",
        productId: "prod-5",
        name: "Organizadores de Cocina Sostenibles",
        price: 48000,
        quantity: 1,
        image: "/sustainable-kitchen-storage.png",
      },
    ],
    total: 83000,
    subtotal: 83000,
    shipping: 0,
    tax: 0,
    discount: 0,
    shippingAddress: {
      name: "Carlos Rodríguez",
      street: "Calle 45 #28-15",
      city: "Bogotá",
      state: "Cundinamarca",
      zip: "110231",
    },
    estimatedDelivery: "2023-04-29T00:00:00Z",
    statusHistory: [
      {
        status: "pending",
        date: "2023-04-25T09:15:00Z",
        description: "Pedido recibido",
      },
      {
        status: "processing",
        date: "2023-04-25T14:30:00Z",
        description: "Pedido en preparación",
      },
    ],
  },
]

export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id)
}

export function getAllOrders(): Order[] {
  return orders
}
