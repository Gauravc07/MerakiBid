"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface EventCarouselProps {
  images: string[]
  altText: string
  interval?: number // Interval in milliseconds
}

export default function EventCarousel({ images, altText, interval = 3000 }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative w-full h-64 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image || "/placeholder.svg"}
          alt={`${altText} - Image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  )
}
