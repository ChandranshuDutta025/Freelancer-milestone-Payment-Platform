"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    if (!ctx) return

    let animId: number
    const nodes: Node[] = []
    const CONNECTION_DIST = 120
    const NODE_COUNT = 45

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function isDark() {
      return document.documentElement.classList.contains("dark")
    }

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.8 + 0.6,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    function draw() {
      const c = ctx!
      const dark = isDark()
      const w = canvas!.width
      const h = canvas!.height

      c.clearRect(0, 0, w, h)

      // subtle grid
      const gridSize = 60
      c.strokeStyle = dark ? "rgba(96, 165, 250, 0.03)" : "rgba(37, 99, 235, 0.04)"
      c.lineWidth = 1
      for (let x = 0; x < w; x += gridSize) {
        c.beginPath()
        c.moveTo(x, 0)
        c.lineTo(x, h)
        c.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        c.beginPath()
        c.moveTo(0, y)
        c.lineTo(w, y)
        c.stroke()
      }

      // update nodes
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
      }

      // draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.2
            c.beginPath()
            c.moveTo(nodes[i].x, nodes[i].y)
            c.lineTo(nodes[j].x, nodes[j].y)
            c.strokeStyle = dark
              ? `rgba(96, 165, 250, ${alpha})`
              : `rgba(37, 99, 235, ${alpha})`
            c.lineWidth = 0.5
            c.stroke()
          }
        }
      }

      // draw nodes
      for (const node of nodes) {
        const gradient = c.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 3
        )
        if (dark) {
          gradient.addColorStop(0, `rgba(96, 165, 250, ${node.opacity})`)
          gradient.addColorStop(1, "rgba(96, 165, 250, 0)")
        } else {
          gradient.addColorStop(0, `rgba(37, 99, 235, ${node.opacity})`)
          gradient.addColorStop(1, "rgba(37, 99, 235, 0)")
        }
        c.beginPath()
        c.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2)
        c.fillStyle = gradient
        c.fill()

        c.beginPath()
        c.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        c.fillStyle = dark
          ? `rgba(96, 165, 250, ${node.opacity + 0.2})`
          : `rgba(37, 99, 235, ${node.opacity + 0.2})`
        c.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
