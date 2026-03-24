'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Reveal {
  id: number
  x: number
  y: number
  message: string
  emoji: string
}

const hiddenMessages = [
  { message: 'Você é minha pessoa favorita no mundo inteiro.', emoji: '🌍' },
  { message: 'Cada conversa nossa é o melhor momento do meu dia.', emoji: '💬' },
  { message: 'Você me faz querer ser a melhor versão de mim.', emoji: '✨' },
  { message: 'Seu sorriso é a coisa mais bonita que já vi.', emoji: '😊' },
  { message: 'Com você, até o silêncio é perfeito.', emoji: '🤍' },
  { message: 'Obrigado por existir na minha vida.', emoji: '🌸' },
  { message: 'Você merece todo o amor do universo.', emoji: '🌌' },
  { message: 'Cada dia ao seu lado é um presente.', emoji: '🎁' },
]

interface MiniGameSectionProps {
  isActive: boolean
}

export default function MiniGameSection({ isActive }: MiniGameSectionProps) {
  const [reveals, setReveals] = useState<Reveal[]>([])
  const [unlocked, setUnlocked] = useState(0)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const counterRef = useRef(0)
  const rippleRef = useRef(0)
  const msgIndexRef = useRef(0)
  const tapCountRef = useRef(0)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInteraction = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Add ripple
    const rippleId = rippleRef.current++
    setRipples(prev => [...prev, { id: rippleId, x, y }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== rippleId)), 1000)

    // Use ref to avoid stale closure on rapid taps
    tapCountRef.current += 1
    const newCount = tapCountRef.current
    setUnlocked(newCount)

    if (newCount % 3 === 0) {
      const msgData = hiddenMessages[msgIndexRef.current % hiddenMessages.length]
      msgIndexRef.current++

      const id = counterRef.current++
      const newReveal: Reveal = {
        id,
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        message: msgData.message,
        emoji: msgData.emoji,
      }
      // Clear any previous reveal and its pending removal
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
      setReveals([newReveal])
      revealTimerRef.current = setTimeout(() => {
        setReveals([])
        revealTimerRef.current = null
      }, 4000)
    }
  }, [])

  const progress = Math.min((unlocked / 24) * 100, 100)
  const heartsCount = Math.floor(unlocked / 3)

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-nebula via-violet-deep to-midnight" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(76,29,149,0.6) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-violet-300/60 text-xs tracking-[0.3em] uppercase font-inter mb-2">capítulo 3</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-gradient italic">
            Segredos do Coração
          </h2>
          <p className="text-white/40 text-xs font-inter mt-3">
            toque para descobrir mensagens escondidas
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          className="w-full mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/30 text-xs font-inter">{heartsCount} mensagens reveladas</span>
            <span className="text-rose-neon/70 text-xs font-inter">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-rose-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Interactive area */}
        <motion.div
          className="relative w-full glass rounded-3xl cursor-pointer select-none overflow-hidden touch-none"
          style={{ height: '320px' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onPointerDown={handleInteraction}
        >
          {/* Background art */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="text-center space-y-3"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-6xl opacity-20">💜</div>
              <p className="text-white/20 text-xs font-inter tracking-widest uppercase">toque aqui</p>
            </motion.div>
          </div>

          {/* Ripples */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.div
                key={ripple.id}
                className="absolute rounded-full border border-violet-400/60 pointer-events-none"
                style={{ left: ripple.x, top: ripple.y, translateX: '-50%', translateY: '-50%' }}
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: 120, height: 120, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>

          {/* Floating hearts from taps */}
          <AnimatePresence>
            {ripples.map(ripple => (
              <motion.div
                key={`heart-${ripple.id}`}
                className="absolute text-2xl pointer-events-none"
                style={{ left: ripple.x, top: ripple.y }}
                initial={{ opacity: 1, scale: 0.5, y: 0, x: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -60, x: (Math.random() - 0.5) * 40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {['❤️', '💜', '💖', '✨', '🌸'][ripple.id % 5]}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Revealed messages */}
          <AnimatePresence>
            {reveals.map(reveal => (
              <motion.div
                key={reveal.id}
                className="absolute glass-strong rounded-2xl px-4 py-3 max-w-[220px] pointer-events-none"
                style={{
                  left: `${Math.min(Math.max(reveal.x, 10), 65)}%`,
                  top: `${Math.min(Math.max(reveal.y, 10), 65)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="text-2xl text-center mb-1">{reveal.emoji}</div>
                <p className="text-white/90 text-xs font-inter text-center leading-relaxed">
                  {reveal.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tap count */}
        <motion.div
          className="mt-5 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex gap-1">
            {Array.from({ length: Math.min(heartsCount, 8) }).map((_, i) => (
              <motion.span
                key={i}
                className="text-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                💜
              </motion.span>
            ))}
          </div>
          {unlocked === 0 && (
            <motion.p
              className="text-white/30 text-xs font-inter"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              toque 3x para revelar...
            </motion.p>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
