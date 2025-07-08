import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EventCarousel from "./event-carousel"

const pastEventsData = [
  {
    id: 1,
    title: "Chapter I",
    date: "December 15, 2023",
    description: "An evening of exquisite dining and live performances.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 2,
    title: "Chapter II",
    date: "August 20, 2023",
    description: "A vibrant celebration of local and international music.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 3,
    title: "Chapter III",
    date: "July 10, 2023",
    description: "Inspiring talks and networking for industry leaders.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 4,
    title: "Chapter IV",
    date: "May 5, 2023",
    description: "Showcasing contemporary art and cultural performances.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 5,
    title: "Chapter V",
    date: "March 22, 2023",
    description: "Raising funds for a noble cause with a night of glamour.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
  {
    id: 6,
    title: "Chapter VI",
    date: "January 18, 2023",
    description: "Unveiling innovative products with a spectacular show.",
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  },
]

export default function PastEventsPageContent() {
  return (
    <section id="past-events-page" className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-platinum-gradient">Our Past Events</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Relive the magic of our most memorable events, meticulously crafted and flawlessly executed.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-12">
          {pastEventsData.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden shadow-silver hover:shadow-lg transition-shadow duration-300 bg-card border border-black-charcoal"
            >
              <EventCarousel images={event.images} altText={event.title} />
              <CardHeader>
                <CardTitle className="font-serif text-2xl text-orange-light">{event.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{event.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
