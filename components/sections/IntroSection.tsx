'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleField from '@/components/ui/ParticleField'

const STARS = Array.from({ length: 40 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  width: Math.random() * 3 + 1,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 4,
}))

interface IntroSectionProps {
  onStart: () => void
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  const [phase, setPhase] = useState(0)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 1800)
    const t3 = setTimeout(() => setPhase(3), 3200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-aurora z-0" />

      {/* Radial glow center */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.div
          className="w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, #ec4899 40%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 z-[1]">
        <ParticleField count={150} interactive={true} />
      </div>

      {/* Stars layer */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        {mounted && STARS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.width}px`,
              height: `${s.width}px`,
            }}
            animate={{ opacity: [0.1, 0.9, 0.1], scale: [1, 1.5, 1] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center space-y-8">
        {/* Small subtitle */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.p
              className="font-inter text-sm tracking-[0.3em] uppercase text-violet-300/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              uma história especial
            </motion.p>
          )}
        </AnimatePresence>

        {/* Main title */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block text-white/90">Para</span>
                <span className="block shimmer-text">Mariana</span>
              </h1>
              <motion.div
                className="flex items-center justify-center gap-3 mt-4"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-neon/60" />
                <motion.span
                  className="text-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ❤️
                </motion.span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-neon/60" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="mt-8"
            >
              <motion.button
                onClick={onStart}
                onHoverStart={() => setButtonHovered(true)}
                onHoverEnd={() => setButtonHovered(false)}
                className="relative group px-10 py-5 rounded-full font-inter text-base font-medium tracking-wide overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))',
                  border: '1px solid rgba(168,85,247,0.5)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={buttonHovered ? {
                    boxShadow: '0 0 40px rgba(168,85,247,0.6), 0 0 80px rgba(236,72,153,0.3)',
                  } : {
                    boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                  }}
                  transition={{ duration: 0.3 }}
                />
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
                  }}
                />
                <span className="relative z-10 text-white flex items-center gap-3">
                  <span>Começar nossa história</span>
                  <motion.span
                    animate={{ x: buttonHovered ? 4 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ✦
                  </motion.span>
                </span>
              </motion.button>

              <motion.p
                className="mt-6 text-white/30 text-xs font-inter tracking-wider"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                feito com amor por Vitor
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-blue to-transparent z-10" />
    </motion.section>
  )
}
