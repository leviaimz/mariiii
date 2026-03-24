'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface DistanceSectionProps {
  isActive: boolean
}

export default function DistanceSection({ isActive }: DistanceSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    if (!isActive) return
    const t = setTimeout(() => setShowText(true), 800)
    return () => clearTimeout(t)
  }, [isActive])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let time = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.008

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.28

      const p1 = { x: cx - radius, y: cy }
      const p2 = { x: cx + radius, y: cy }

      // Draw connection line with pulse
      const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
      gradient.addColorStop(0, 'rgba(168,85,247,0.9)')
      gradient.addColorStop(0.5, 'rgba(236,72,153,0.6)')
      gradient.addColorStop(1, 'rgba(168,85,247,0.9)')

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)

      // Wavy line
      const segments = 80
      for (let i = 0; i <= segments; i++) {
        const t2 = i / segments
        const x = p1.x + (p2.x - p1.x) * t2
        const wave = Math.sin(t2 * Math.PI * 4 + time * 2) * 8 * Math.sin(t2 * Math.PI)
        ctx.lineTo(x, cy + wave)
      }

      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Pulse dots traveling along the line
      for (let i = 0; i < 3; i++) {
        const progress = ((time * 0.4 + i * 0.33) % 1)
        const px = p1.x + (p2.x - p1.x) * progress
        const wave = Math.sin(progress * Math.PI * 4 + time * 2) * 8 * Math.sin(progress * Math.PI)
        const py = cy + wave

        const opacity = Math.sin(progress * Math.PI) * 0.9
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6)
        grad.addColorStop(0, `rgba(244,114,182,${opacity})`)
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(px, py, 6, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      // Node 1 - Vitor (left)
      const pulse1 = 1 + Math.sin(time * 1.5) * 0.12
      for (let r = 3; r >= 0; r--) {
        const glow = ctx.createRadialGradient(p1.x, p1.y, 0, p1.x, p1.y, (22 + r * 12) * pulse1)
        glow.addColorStop(0, r === 0 ? 'rgba(168,85,247,0.9)' : `rgba(168,85,247,${0.08 - r * 0.02})`)
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, (22 + r * 12) * pulse1, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(p1.x, p1.y, 10 * pulse1, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(168,85,247,1)'
      ctx.fill()

      // Node 2 - Mariana (right)
      const pulse2 = 1 + Math.sin(time * 1.5 + Math.PI) * 0.12
      for (let r = 3; r >= 0; r--) {
        const glow = ctx.createRadialGradient(p2.x, p2.y, 0, p2.x, p2.y, (22 + r * 12) * pulse2)
        glow.addColorStop(0, r === 0 ? 'rgba(236,72,153,0.9)' : `rgba(236,72,153,${0.08 - r * 0.02})`)
        glow.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p2.x, p2.y, (22 + r * 12) * pulse2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()
      }
      ctx.beginPath()
      ctx.arc(p2.x, p2.y, 10 * pulse2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(236,72,153,1)'
      ctx.fill()

      // Labels
      ctx.font = '13px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.textAlign = 'center'
      ctx.fillText('Vitor', p1.x, p1.y + 34)
      ctx.fillText('Mariana', p2.x, p2.y + 34)

      ctx.font = 'italic 11px Inter, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      const dist = Math.round(radius * 2 * 1.2)
      ctx.fillText(`${dist} km... mas sempre conectados`, cx, cy - 30)

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [isActive])

  const textLines = [
    'A distância pode ser medida em quilômetros...',
    'mas o que sinto por você',
    'não cabe em nenhuma unidade.',
  ]

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.2 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic via-midnight to-nebula" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(45,27,105,0.8) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto px-6 flex flex-col items-center">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-violet-300/60 text-xs tracking-[0.3em] uppercase font-inter mb-2">capítulo 2</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-gradient italic">
            A Distância
          </h2>
        </motion.div>

        {/* Canvas visualization */}
        <motion.div
          className="w-full glass rounded-3xl overflow-hidden"
          style={{ height: '260px' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.9 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </motion.div>

        {/* Text content */}
        <div className="mt-10 text-center space-y-4">
          {showText && textLines.map((line, i) => (
            <motion.p
              key={i}
              className={`font-playfair text-white/80 ${i === 1 ? 'text-xl text-gradient italic' : 'text-base text-white/60'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          className="mt-10 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: showText ? 1 : 0 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-violet-500/50" />
          <span className="text-violet-400/60 text-lg">∞</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-violet-500/50" />
        </motion.div>
      </div>
    </motion.section>
  )
}
