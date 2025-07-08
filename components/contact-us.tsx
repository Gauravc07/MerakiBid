"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react"

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Thank you for your message! We will get back to you soon.")
    setIsSubmitting(false)
  }

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gold-gradient">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Let's create something extraordinary together. Reach out to us for inquiries or collaborations.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <MailIcon className="h-8 w-8 text-orange-light" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">themerakicreations2025@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <PhoneIcon className="h-8 w-8 text-orange-light" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Phone</h3>
                <p className="text-muted-foreground">+91 7758095284</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPinIcon className="h-8 w-8 text-orange-light" />
              <div>
                <h3 className="font-serif text-xl font-semibold text-foreground">Address</h3>
                <p className="text-muted-foreground">Pune, India </p>
              </div>
            </div>
          </div>
          <div className="bg-card-overlay p-8 rounded-lg shadow-silver border border-black-charcoal">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  required
                  className="bg-background border-black-charcoal text-foreground focus:ring-orange"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className="bg-background border-black-charcoal text-foreground focus:ring-orange"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-foreground">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Subject of your message"
                  required
                  className="bg-background border-black-charcoal text-foreground focus:ring-orange"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-foreground">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="bg-background border-black-charcoal text-foreground focus:ring-orange"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange text-primary-foreground hover:bg-orange-dark transition-colors shadow-md hover:shadow-lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
