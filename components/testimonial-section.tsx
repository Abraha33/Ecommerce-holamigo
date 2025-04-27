import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "The eco-friendly storage containers are amazing! They're durable, look great, and I feel good about reducing my plastic waste.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100&query=woman+avatar",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Restaurant Owner",
    content:
      "We've switched all our takeout containers to EcoPlast's compostable options. Our customers love it and it's helped our business become more sustainable.",
    rating: 5,
    avatar: "/placeholder.svg?height=100&width=100&query=man+avatar",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Gardening Enthusiast",
    content:
      "The recycled plastic planters are perfect for my garden. They're lightweight, weather-resistant, and made from recycled materials. Win-win!",
    rating: 4,
    avatar: "/placeholder.svg?height=100&width=100&query=woman+avatar+2",
  },
]

export function TestimonialSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our customers have to say about our eco-friendly products.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 flex-1">{testimonial.content}</p>
                <div className="flex items-center mt-auto">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
