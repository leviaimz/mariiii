'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingHearts from '@/components/ui/FloatingHearts'

const messages = [
  { id: 1, from: 'vitor', text: 'Oi... sabia que fico pensando em você toda hora?', delay: 400 },
  { id: 2, from: 'mariana', text: 'É?? Todo hora assim?? 😊', delay: 2000 },
  { id: 3, from: 'vitor', text: 'Cada vez que vejo uma coisa bonita... penso em te mostrar.', delay: 3600 },
  { id: 4, from: 'vitor', text: 'Cada música boa que eu ouço... quero que você ouça junto.', delay: 5400 },
  { id: 5, from: 'mariana', text: 'Vitor... 🥹', delay: 7000 },
  { id: 6, from: 'vitor', text: 'A distância é difícil, eu sei...', delay: 8600 },
  { id: 7, from: 'vitor', text: 'Mas você é a razão mais bonita do meu dia.', delay: 10400 },
  { id: 8, from: 'mariana', text: 'Você é demais pra mim 💜', delay: 12000 },
  { id: 9, from: 'vitor', text: 'Não é demais. É exatamente o quanto você merece.', delay: 13800 },
]

interface MessageBubbleProps {
  message: (typeof messages)[0]
  isTyping?: boolean
}

function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isVitor = message.from === 'vitor'

  return (
    <motion.div
      className={`flex ${isVitor ? 'justify-end' : 'justify-start'} w-full`}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {!isVitor && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center text-sm font-bold mr-2 self-end mb-1">
          M
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl font-inter text-sm leading-relaxed ${
          isVitor
            ? 'rounded-br-sm bg-gradient-to-br from-violet-600/80 to-purple-700/80 text-white border border-violet-500/30'
            : 'rounded-bl-sm bg-white/8 text-white/90 border border-white/10'
        }`}
        style={{ backdropFilter: 'blur(10px)' }}
      >
        {isTyping ? (
          <div className="flex gap-1 items-center py-1">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-white/60"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          message.text
        )}
      </div>
      {isVitor && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-sm font-bold ml-2 self-end mb-1">
          V
        </div>
      )}
    </motion.div>
  )
}

interface MemoriesSectionProps {
  isActive: boolean
}

export default function MemoriesSection({ isActive }: MemoriesSectionProps) {
  const [visibleMessages, setVisibleMessages] = useState<typeof messages>([])
  const [typingFor, setTypingFor] = useState<number | null>(null)
  const [heartsActive, setHeartsActive] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return
    setHeartsActive(true)
    setVisibleMessages([])
    setTypingFor(null)

    const timers: ReturnType<typeof setTimeout>[] = []

    messages.forEach((msg) => {
      const typingDelay = msg.delay - 800
      if (typingDelay > 0) {
        timers.push(setTimeout(() => setTypingFor(msg.id), typingDelay))
      }
      timers.push(setTimeout(() => {
        setTypingFor(null)
        setVisibleMessages(prev =>
          prev.some(m => m.id === msg.id) ? prev : [...prev, msg]
        )
      }, msg.delay))
    })

    return () => {
      timers.forEach(clearTimeout)
      setVisibleMessages([])
      setTypingFor(null)
    }
  }, [isActive])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleMessages])

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-cosmic to-midnight" />
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 20% 50%, rgba(168,85,247,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(236,72,153,0.2) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Floating hearts layer */}
      {heartsActive && (
        <FloatingHearts autoSpawn={true} spawnInterval={3000} maxHearts={10} />
      )}

      {/* Section Header */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-violet-300/60 text-xs tracking-[0.3em] uppercase font-inter mb-2">capítulo 1</p>
          <h2 className="font-playfair text-3xl md:text-4xl text-gradient italic">
            Memórias
          </h2>
          <p className="text-white/40 text-xs font-inter mt-2">toque na tela para liberar corações</p>
        </motion.div>

        {/* Chat container */}
        <div
          className="glass rounded-3xl p-4 space-y-3 min-h-[400px] max-h-[60vh] overflow-y-auto relative"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence>
            {visibleMessages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {typingFor !== null && (
            <AnimatePresence>
              <MessageBubble
                key={`typing-${typingFor}`}
                message={messages.find(m => m.id === typingFor)!}
                isTyping={true}
              />
            </AnimatePresence>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Heart interaction hint */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass rounded-full px-5 py-2.5 text-white/50 text-xs font-inter"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span>💜</span>
            <span>role para continuar</span>
            <span>💜</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
