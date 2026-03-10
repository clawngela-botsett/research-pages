"use client"

import { motion } from "framer-motion"

interface PulsingCircleProps {
  size?: number
  color?: string
  className?: string
}

export function PulsingCircle({ 
  size = 12, 
  color = "#10b981",
  className = "" 
}: PulsingCircleProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.div
        className="rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}



