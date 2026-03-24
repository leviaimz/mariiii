'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IntroSection from '@/components/sections/IntroSection'
import MemoriesSection from '@/components/sections/MemoriesSection'
import DistanceSection from '@/components/sections/DistanceSection'
import MiniGameSection from '@/components/sections/MiniGameSection'
import FutureSection from '@/components/sections/FutureSection'
import FinalSection from '@/components/sections/FinalSection'
import TransitionOverlay from '@/components/sections/TransitionOverlay'

type Section = 'intro' | 'memories' | 'distance' | 'minigame' | 'future' | 'final'

const sectionOrder: Section[] = ['intro', 'memories', 'distance', 'minigame', 'future', 'final']

const sectionLabels: Record<Section, string> = {
  intro: '',
  memories: 'Memórias',
  distance: 'A Distância',
  minigame: 'Segredos',
  future: 'O Futuro',
  final: 'Amor',
}

export default function Home() {
  const [current, setCurrent] = useState<Section>('intro')
  const [transitioning, setTransitioning] = useState(false)
  const [started, setStarted] = useState(false)
  const lockRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const navigateTo = (section: Section) => {
    if (lockRef.current) return
    lockRef.current = true
    setTransitioning(true)
    // Switch content while overlay is fully covering screen
    setTimeout(() => {
      setCurrent(section)
    }, 700)
    // Fade overlay out after content has switched
    setTimeout(() => {
      setTransitioning(false)
      lockRef.current = false
    }, 1400)
  }

  const handleStart = () => {
    setStarted(true)
    navigateTo('memories')
  }

  const handleNext = () => {
    const idx = sectionOrder.indexOf(current)
    if (idx < sectionOrder.length - 1) {
      navigateTo(sectionOrder[idx + 1])
    }
  }

  const currentIndex = sectionOrder.indexOf(current)

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-deep-blue">
      {/* Transition overlay */}
      <TransitionOverlay isVisible={transitioning} />

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="w-full min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {current === 'intro' && <IntroSection onStart={handleStart} />}
          {current === 'memories' && <MemoriesSection isActive={true} />}
          {current === 'distance' && <DistanceSection isActive={true} />}
          {current === 'minigame' && <MiniGameSection isActive={true} />}
          {current === 'future' && <FutureSection isActive={true} />}
          {current === 'final' && <FinalSection isActive={true} onRestart={() => navigateTo('intro')} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots (only after started, not on final) */}
      {started && current !== 'final' && (
        <motion.div
          className="fixed left-1/2 z-40"
          style={{ x: '-50%', top: 'calc(1.5rem + env(safe-area-inset-top))' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
            {sectionOrder.slice(1).map((sec, i) => {
              const idx = i + 1
              const isActive = current === sec
              const isCompleted = currentIndex > idx
              return (
                <motion.button
                  key={sec}
                  className={`rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 h-2 bg-gradient-to-r from-violet-400 to-rose-400'
                      : isCompleted
                      ? 'w-2 h-2 bg-violet-500/60'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  title={sectionLabels[sec]}
                />
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Next chapter button (not on intro or final) */}
      {started && current !== 'intro' && current !== 'final' && !transitioning && (
        <motion.div
          className="fixed left-1/2 z-40"
          style={{ x: '-50%', bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            onClick={handleNext}
            className="glass rounded-full px-6 py-3 text-white/60 text-sm font-inter tracking-wide flex items-center gap-2 group hover:text-white/90 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(168,85,247,0.4)',
              boxShadow: '0 0 20px rgba(168,85,247,0.2)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            <span>próximo capítulo</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      )}
    </main>
  )
}
