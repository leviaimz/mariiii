'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  color: string
  twinkleSpeed: number
  twinklePhase: number
}

interface ParticleFieldProps {
  count?: number
  colors?: string[]
  className?: string
  interactive?: boolean
}

export default function ParticleField({
  count = 120,
  colors = ['#a855f7', '#f472b6', '#667eea', '#fbbf24', '#ffffff'],
  className = '',
  interactive = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }))
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (e instanceof MouseEvent) {
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      } else if (e instanceof TouchEvent && e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    let time = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      particlesRef.current.forEach(p => {
        p.twinklePhase += p.twinkleSpeed
        const twinkle = 0.5 + 0.5 * Math.sin(p.twinklePhase)
        const opacity = p.opacity * twinkle

        if (interactive) {
          const dx = mouseRef.current.x - p.x
          const dy = mouseRef.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const force = (100 - dist) / 100
            p.vx -= (dx / dist) * force * 0.5
            p.vy -= (dy / dist) * force * 0.5
          }
        }

        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = opacity
        ctx.fill()

        if (p.radius > 1) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5)
          grad.addColorStop(0, p.color)
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.globalAlpha = opacity * 0.3
          ctx.fill()
        }

        ctx.globalAlpha = 1
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
      canvas.addEventListener('touchmove', handleMouseMove)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('touchmove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [count, colors, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
    />
  )
}
