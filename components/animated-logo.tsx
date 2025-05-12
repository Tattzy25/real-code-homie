"use client"

import { useEffect, useRef } from "react"

interface AnimatedLogoProps {
  size?: number
}

export function AnimatedLogo({ size = 48 }: AnimatedLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = size
    canvas.height = size

    // Animation variables
    let hue = 0
    const particles: Particle[] = []
    const particleCount = 20

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.size = Math.random() * 2 + 1
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 1 + 0.5
        this.speedX = Math.cos(angle) * speed
        this.speedY = Math.sin(angle) * speed
        this.color = `hsl(${hue}, 100%, 50%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.2) this.size -= 0.05
      }

      draw() {
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw logo base
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2)
      ctx.fillStyle = "#000"
      ctx.fill()
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw code symbol
      ctx.beginPath()
      ctx.moveTo(size / 3, size / 3)
      ctx.lineTo(size / 2.5, size / 2)
      ctx.lineTo(size / 3, size / 1.5)
      ctx.strokeStyle = `hsl(${hue + 60}, 100%, 50%)`
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(size / 1.5, size / 3)
      ctx.lineTo(size / 1.8, size / 2)
      ctx.lineTo(size / 1.5, size / 1.5)
      ctx.strokeStyle = `hsl(${hue + 120}, 100%, 50%)`
      ctx.lineWidth = 2
      ctx.stroke()

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        if (particles[i].size <= 0.2) {
          particles.splice(i, 1)
          i--
        }
      }

      // Add new particles
      if (Math.random() > 0.8 && particles.length < particleCount) {
        particles.push(new Particle())
      }

      // Update hue
      hue = (hue + 0.5) % 360

      requestAnimationFrame(animate)
    }

    animate()
  }, [size])

  return <canvas ref={canvasRef} width={size} height={size} className="rounded-md" />
}
