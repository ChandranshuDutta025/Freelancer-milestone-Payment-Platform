"use client"

import { useEffect, useRef } from "react"

export function MouseFollower() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    if (!ctx) return

    let animId: number
    let mx = -200
    let my = -200
    let targetX = -200
    let targetY = -200
    let isVisible = false
    let trailTimeout: ReturnType<typeof setTimeout> | null = null

    const trail: { x: number; y: number; life: number }[] = []
    const MAX_TRAIL = 16

    function isDark() {
      return document.documentElement.classList.contains("dark")
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function handleMove(e: MouseEvent) {
      targetX = e.clientX
      targetY = e.clientY
      isVisible = true
      if (trailTimeout) clearTimeout(trailTimeout)
      trailTimeout = setTimeout(() => { isVisible = false }, 2000)
    }

    window.addEventListener("mousemove", handleMove)

    function draw() {
      const c = ctx!
      const dark = isDark()
      const w = canvas!.width
      const h = canvas!.height

      c.clearRect(0, 0, w, h)

      // smooth follow
      mx += (targetX - mx) * 0.12
      my += (targetY - my) * 0.12

      if (isVisible) {
        trail.push({ x: mx, y: my, life: 1 })
        if (trail.length > MAX_TRAIL) trail.shift()
      }

      // draw trail
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i]
        t.life -= 0.03
        if (t.life <= 0) continue

        const alpha = t.life * 0.4
        const radius = (1 - t.life) * 4 + 1

        c.beginPath()
        c.arc(t.x, t.y, radius, 0, Math.PI * 2)
        c.fillStyle = dark
          ? `rgba(148, 180, 255, ${alpha})`
          : `rgba(60, 100, 220, ${alpha})`
        c.fill()
      }

      // orbiting particles around cursor
      const orbCount = 4
      for (let i = 0; i < orbCount; i++) {
        const angle = (i / orbCount) * Math.PI * 2 + performance.now() * 0.001
        const dist = 12 + Math.sin(performance.now() * 0.002 + i) * 4
        const ox = mx + Math.cos(angle) * dist
        const oy = my + Math.sin(angle) * dist
        c.beginPath()
        c.arc(ox, oy, 1.2, 0, Math.PI * 2)
        c.fillStyle = dark
          ? `rgba(180, 210, 255, 0.5)`
          : `rgba(60, 100, 220, 0.4)`
        c.fill()
      }

      // central dot
      if (trail.length > 1) {
        c.beginPath()
        c.arc(mx, my, 1.5, 0, Math.PI * 2)
        c.fillStyle = dark
          ? "rgba(180, 210, 255, 0.6)"
          : "rgba(60, 100, 220, 0.5)"
        c.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMove)
      if (trailTimeout) clearTimeout(trailTimeout)
    }
  }, [])

  if (typeof window !== "undefined" && window.innerWidth < 768) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 hidden md:block"
    />
  )
}
