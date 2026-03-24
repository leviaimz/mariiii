'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FutureSectionProps {
  isActive: boolean
}

const WARM_PARTICLES = Array.from({ length: 30 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 4 + 5,
  delay: Math.random() * 5,
}))

const futureCards = [
  {
    emoji: '🌅',
    title: 'Manhãs juntos',
    text: 'Acordar do seu lado, com café passando e nenhuma pressa no mundo.',
    delay: 0.2,
  },
  {
    emoji: '✈️',
    title: 'Lugares novos',
    text: 'Cada viagem é melhor quando você está do meu lado para se perder junto.',
    delay: 0.5,
  },
  {
    emoji: '🌙',
    title: 'Noites estreladas',
    text: 'Olhar pro céu e saber que você é o que mais brilha na minha vida.',
    delay: 0.8,
  },
  {
    emoji: '🏡',
    title: 'Um lar',
    text: 'Não importa o lugar. Com você, qualquer canto se torna meu lugar favorito.',
    delay: 1.1,
  },
]

export default function FutureSection({ isActive }: FutureSectionProps) {
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    if (!isActive) return
    const t = setTimeout(() => setShowCards(true), 600)
    return () => clearTimeout(t)
  }, [isActive])

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Warm sunrise background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0d0520 0%, #1a0a3e 20%, #2d1260 45%, #4a1060 70%, #7b2d5e 90%, #c2546a 100%)',
        }}
      />

      {/* Golden glow from bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(251,146,60,0.25) 0%, rgba(251,191,36,0.1) 30%, transparent 60%)',
        }}
      />

      {/* Soft light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 origin-bottom"
            style={{
              left: `${30 + i * 8}%`,
              width: '2px',
              height: '60%',
              background: 'linear-gradient(to top, rgba(251,191,36,0.8), transparent)',
              transform: `rotate(${-15 + i * 6}deg)`,
            }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}
      </div>

      {/* Floating particles (warm) */}
      <div className="absolute inset-0 overflow-hidden">
        {WARM_PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: ['#fbbf24', '#f472b6', '#fb923c', '#f9a8d4'][i % 4],
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center">
        {/* Section header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
          transition={{ duration: 1 }}
        >
          <p className="text-amber-300/60 text-xs tracking-[0.3em] uppercase font-inter mb-2">capítulo 4</p>
          <h2
            className="font-playfair text-3xl md:text-4xl font-bold italic"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f472b6, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            O Nosso Futuro
          </h2>
          <p className="text-white/40 text-sm font-inter mt-3 font-light italic">
            tudo que ainda vamos viver...
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 w-full">
          {futureCards.map((card, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl p-5 flex items-start gap-4 cursor-default"
              style={{
                border: '1px solid rgba(251,191,36,0.15)',
                background: 'rgba(255,255,255,0.04)',
              }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30, y: 20 }}
              animate={showCards ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: card.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                scale: 1.02,
                borderColor: 'rgba(251,191,36,0.3)',
                boxShadow: '0 0 30px rgba(251,191,36,0.1)',
              }}
            >
              <motion.div
                className="text-3xl flex-shrink-0"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              >
                {card.emoji}
              </motion.div>
              <div>
                <h3
                  className="font-playfair text-base font-semibold mb-1"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f9a8d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-white/60 text-sm font-inter leading-relaxed">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom promise */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showCards ? 1 : 0 }}
          transition={{ delay: 2 }}
        >
          <p className="font-playfair text-white/70 italic text-base leading-relaxed">
            "Não sei o que o futuro reserva...
            <br />
            mas sei que quero vivê-lo com você."
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/40" />
            <span
              className="text-sm font-inter"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              — Vitor
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/40" />
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
