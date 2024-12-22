import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import topics from "../data/topics"

export function TopicsCarousel() {
  const [emblaRef] = useEmblaCarousel(
    {
      align: 'center',
      loop: true,
      skipSnaps: true,
      dragFree: true,
      containScroll: 'trimSnaps'
    },
    [
      AutoScroll({
        speed: 2.5,
        playOnInit: true,
        stopOnInteraction: false
      })
    ]
  )

  return (
    <div className="relative max-w-[1200px] mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {[...topics, ...topics].map((topic, index) => (
            <div
              className="flex-[0_0_33.33%] min-w-0 pl-4"
              key={`${topic.title}-${index}`}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 h-full mx-2">
                <CardHeader className="bg-gradient-to-br from-blue-950 to-blue-900 p-6 min-h-[100px] flex items-center justify-center">
                  <CardTitle className="text-center text-white flex items-center justify-center gap-2 w-full">
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <topic.icon className="h-6 w-6 flex-shrink-0" />
                      <span className="text-lg font-semibold truncate">{topic.title}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="aspect-video bg-blue-100 rounded-lg overflow-hidden">
                    <img
                      src={topic.image}
                      alt={topic.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
