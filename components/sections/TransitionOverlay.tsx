'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface TransitionOverlayProps {
  isVisible: boolean
}

export default function TransitionOverlay({ isVisible }: TransitionOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #1a0a3e 0%, #050818 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              ✦
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
