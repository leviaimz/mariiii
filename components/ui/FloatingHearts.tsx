'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Heart {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  drift: number
}

interface FloatingHeartsProps {
  autoSpawn?: boolean
  spawnInterval?: number
  maxHearts?: number
}

export default function FloatingHearts({
  autoSpawn = true,
  spawnInterval = 2000,
  maxHearts = 15,
}: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Heart[]>([])
  const counterRef = useRef(0)

  const spawnHeart = useCallback((x?: number, y?: number) => {
    const id = counterRef.current++
    const newHeart: Heart = {
      id,
      x: x ?? Math.random() * 100,
      y: y ?? 100,
      size: Math.random() * 20 + 16,
      color: ['#f472b6', '#a855f7', '#ec4899', '#c084fc', '#fb7185'][Math.floor(Math.random() * 5)],
      duration: Math.random() * 3 + 4,
      drift: (Math.random() - 0.5) * 80,
    }
    setHearts(prev => [...prev.slice(-maxHearts + 1), newHeart])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id))
    }, (newHeart.duration + 1) * 1000)
  }, [maxHearts])

  useEffect(() => {
    if (!autoSpawn) return
    const interval = setInterval(() => {
      spawnHeart()
    }, spawnInterval)
    return () => clearInterval(interval)
  }, [autoSpawn, spawnInterval, spawnHeart])

  const handlePointerDown = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const xPct = ((e.clientX - rect.left) / rect.width) * 100
    const yPct = ((e.clientY - rect.top) / rect.height) * 100
    for (let i = 0; i < 5; i++) {
      setTimeout(() => spawnHeart(xPct + (Math.random() - 0.5) * 10, yPct), i * 100)
    }
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-auto"
      onPointerDown={handlePointerDown}
    >
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute pointer-events-none select-none"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              fontSize: heart.size,
              color: heart.color,
              filter: `drop-shadow(0 0 8px ${heart.color})`,
            }}
            initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
            animate={{
              opacity: [1, 1, 0],
              y: -200,
              x: heart.drift,
              scale: [0.5, 1.2, 0.8],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: heart.duration,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { times: [0, 0.7, 1] },
            }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
