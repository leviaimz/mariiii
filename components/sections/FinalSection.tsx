'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FinalSectionProps {
  isActive: boolean
  onRestart: () => void
}

export default function FinalSection({ isActive, onRestart }: FinalSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!isActive) return
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2400)
    const t3 = setTimeout(() => setPhase(3), 4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
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

    interface Spark {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      color: string
    }

    const sparks: Spark[] = []
    const colors = ['#f472b6', '#a855f7', '#fbbf24', '#ec4899', '#c084fc', '#fb923c', '#fff']

    const spawnSparks = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2 + 0.5
        sparks.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: Math.random() * 120 + 80,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    let time = 0
    let sparkTimer = 0

    const draw = () => {
      ctx.fillStyle = 'rgba(5,8,24,0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.016
      sparkTimer++

      if (sparkTimer % 8 === 0) {
        spawnSparks(
          canvas.width / 2 + (Math.random() - 0.5) * 60,
          canvas.height / 2 + (Math.random() - 0.5) * 80,
          3
        )
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.vy += 0.015
        s.vx *= 0.99
        s.life -= 1 / s.maxLife

        if (s.life <= 0) {
          sparks.splice(i, 1)
          continue
        }

        const alpha = s.life * 0.9
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.globalAlpha = alpha
        ctx.fill()

        const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3)
        glowGrad.addColorStop(0, s.color)
        glowGrad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = glowGrad
        ctx.globalAlpha = alpha * 0.4
        ctx.fill()

        ctx.globalAlpha = 1
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [isActive])

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 2 }}
    >
      {/* Deep dark background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #1a0a3e 0%, #0d0520 40%, #050818 100%)',
        }}
      />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Central glow */}
      <AnimatePresence>
        {phase >= 1 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className="w-[500px] h-[500px] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.08) 40%, transparent 70%)',
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 space-y-8">

        {/* Heart */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div
                className="text-7xl md:text-8xl"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 30px rgba(236,72,153,0.8)) drop-shadow(0 0 60px rgba(168,85,247,0.4))' }}
              >
                ❤️
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main declaration */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h1 className="font-playfair font-bold leading-tight">
                <motion.span
                  className="block text-4xl md:text-5xl lg:text-6xl text-white/90 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                >
                  Eu te amo,
                </motion.span>
                <motion.span
                  className="block text-5xl md:text-6xl lg:text-7xl shimmer-text italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 1 }}
                >
                  Mariana.
                </motion.span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Signature */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent to-rose-neon/50"
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
                <motion.p
                  className="font-playfair text-xl text-white/70 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                >
                  — Vitor ❤️
                </motion.p>
                <motion.div
                  className="h-px bg-gradient-to-l from-transparent to-rose-neon/50"
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ delay: 0.3, duration: 1 }}
                />
              </div>

              {/* Final flourish */}
              <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
              >
                <p className="text-white/30 text-sm font-inter tracking-wider">
                  sempre, para sempre
                </p>
                <motion.div
                  className="flex items-center justify-center gap-2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {'✦ ✦ ✦'.split(' ').map((star, i) => (
                    <motion.span
                      key={i}
                      className="text-violet-400/60 text-xs"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {star}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* Restart button */}
              <motion.button
                className="mt-4 px-8 py-3 rounded-full glass text-white/50 text-sm font-inter tracking-wider hover:text-white/80 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(168,85,247,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={onRestart}
              >
                recomeçar do início ↑
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
