"use client"

import { useEffect, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function MouseFollower() {
  const cursorX = useMotionValue(-200)
  const cursorY = useMotionValue(-200)

  const springX = useSpring(cursorX, { stiffness: 200, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 200, damping: 30 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    },
    [cursorX, cursorY],
  )

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-0 hidden md:block"
      style={{
        x: springX,
        y: springY,
      }}
    >
      <div className="h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-200/30 via-blue-100/20 to-transparent dark:from-blue-500/5 dark:via-blue-400/3 blur-3xl" />
    </motion.div>
  )
}
