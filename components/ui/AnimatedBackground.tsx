"use client"

import { useEffect, useRef } from "react"

interface Blob {
  x: number
  y: number
  radius: number
  points: { angle: number; radius: number; speed: number; phase: number }[]
  hue: number
  sat: number
  light: number
  alpha: number
  pulse: number
  pulseSpeed: number
  vx: number
  vy: number
}

interface Dust {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  drift: number
  phase: number
}

interface Geo {
  x: number
  y: number
  size: number
  rotation: number
  rotSpeed: number
  type: "tri" | "dia" | "hex"
  opacity: number
  phase: number
  floatSpeed: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    if (!ctx) return

    let animId: number

    function isDark() {
      return document.documentElement.classList.contains("dark")
    }

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function createBlob(w: number, h: number): Blob {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 100 + Math.random() * 220,
        points: Array.from({ length: 8 }, () => ({
          angle: Math.random() * Math.PI * 2,
          radius: 0.6 + Math.random() * 0.4,
          speed: 0.0015 + Math.random() * 0.004,
          phase: Math.random() * Math.PI * 2,
        })),
        hue: 200 + Math.random() * 60,
        sat: 50 + Math.random() * 40,
        light: 45 + Math.random() * 25,
        alpha: 0.03 + Math.random() * 0.035,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.002 + Math.random() * 0.004,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }
    }

    const blobs: Blob[] = Array.from({ length: 5 }, () => createBlob(canvas.width, canvas.height))

    const geometries: Geo[] = Array.from({ length: 10 }, () => ({
      x: Math.random() * (canvas.width + 400) - 200,
      y: Math.random() * (canvas.height + 400) - 200,
      size: 5 + Math.random() * 18,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.004,
      type: (["tri", "dia", "hex"] as const)[Math.floor(Math.random() * 3)],
      opacity: 0.02 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
      floatSpeed: 0.001 + Math.random() * 0.003,
    }))

    const dust: Dust[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * (canvas.width + 200) - 100,
      y: Math.random() * (canvas.height + 200) - 100,
      size: 0.4 + Math.random() * 1.2,
      speed: 0.08 + Math.random() * 0.25,
      opacity: 0.08 + Math.random() * 0.25,
      drift: (Math.random() - 0.5) * 0.25,
      phase: Math.random() * Math.PI * 2,
    }))

    // noise texture (generated once)
    const noiseCanvas = document.createElement("canvas")
    noiseCanvas.width = 256
    noiseCanvas.height = 256
    const nctx = noiseCanvas.getContext("2d")!
    const imageData = nctx.createImageData(256, 256)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255
      imageData.data[i] = v
      imageData.data[i + 1] = v
      imageData.data[i + 2] = v
      imageData.data[i + 3] = 12
    }
    nctx.putImageData(imageData, 0, 0)
    const noisePattern = ctx.createPattern(noiseCanvas, "repeat")!

    function drawBlob(b: Blob, dark: boolean) {
      b.x += b.vx
      b.y += b.vy
      const w = canvas!.width
      const h = canvas!.height
      if (b.x < -b.radius) b.x = w + b.radius
      if (b.x > w + b.radius) b.x = -b.radius
      if (b.y < -b.radius) b.y = h + b.radius
      if (b.y > h + b.radius) b.y = -b.radius
      b.pulse += b.pulseSpeed
      for (const p of b.points) p.angle += p.speed

      const pf = 1 + Math.sin(b.pulse) * 0.06
      const r = b.radius * pf
      const pts = b.points.map((p) => ({
        x: b.x + Math.cos(p.angle) * r * p.radius,
        y: b.y + Math.sin(p.angle) * r * p.radius,
      }))

      ctx!.beginPath()
      ctx!.moveTo(pts[0].x, pts[0].y)
      for (let i = 0; i < pts.length; i++) {
        const cur = pts[i]
        const nxt = pts[(i + 1) % pts.length]
        ctx!.quadraticCurveTo(cur.x, cur.y, (cur.x + nxt.x) / 2, (cur.y + nxt.y) / 2)
      }
      ctx!.closePath()

      const hShift = b.hue + Math.sin(b.pulse * 0.6) * 12
      const sShift = b.sat + Math.sin(b.pulse * 0.4) * 10
      const lShift = b.light + Math.sin(b.pulse * 0.3) * 6
      ctx!.fillStyle = dark
        ? `hsla(${hShift}, ${sShift}%, ${lShift}%, ${b.alpha})`
        : `hsla(${hShift}, ${sShift}%, ${lShift + 15}%, ${b.alpha * 1.4})`
      ctx!.fill()
    }

    function drawGeo(g: Geo, dark: boolean) {
      g.rotation += g.rotSpeed
      g.phase += g.floatSpeed
      g.y += Math.sin(g.phase * 0.7) * 0.04
      g.x += Math.cos(g.phase * 0.5) * 0.03
      const w = canvas!.width
      const h = canvas!.height
      if (g.x < -200) g.x = w + 200
      if (g.x > w + 200) g.x = -200
      if (g.y < -200) g.y = h + 200
      if (g.y > h + 200) g.y = -200

      ctx!.save()
      ctx!.translate(g.x, g.y)
      ctx!.rotate(g.rotation)
      const a = g.opacity * (0.7 + 0.3 * Math.sin(g.phase))
      ctx!.strokeStyle = dark
        ? `rgba(200, 220, 255, ${a})`
        : `rgba(30, 60, 160, ${a})`
      ctx!.lineWidth = 0.7
      ctx!.beginPath()
      if (g.type === "tri") {
        for (let i = 0; i < 3; i++) {
          const ang = (i / 3) * Math.PI * 2 - Math.PI / 2
          i === 0 ? ctx!.moveTo(Math.cos(ang) * g.size, Math.sin(ang) * g.size) : ctx!.lineTo(Math.cos(ang) * g.size, Math.sin(ang) * g.size)
        }
        ctx!.closePath()
      } else if (g.type === "dia") {
        ctx!.moveTo(0, -g.size)
        ctx!.lineTo(g.size, 0)
        ctx!.lineTo(0, g.size)
        ctx!.lineTo(-g.size, 0)
        ctx!.closePath()
      } else {
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2 - Math.PI / 2
          i === 0 ? ctx!.moveTo(Math.cos(ang) * g.size, Math.sin(ang) * g.size) : ctx!.lineTo(Math.cos(ang) * g.size, Math.sin(ang) * g.size)
        }
        ctx!.closePath()
      }
      ctx!.stroke()
      ctx!.restore()
    }

    function drawDust(d: Dust, w: number, h: number) {
      d.y -= d.speed
      d.x += Math.sin(d.phase) * d.drift
      d.phase += 0.008
      if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w }
      if (d.x < -10) d.x = w + 10
      if (d.x > w + 10) d.x = -10
      ctx!.beginPath()
      ctx!.arc(d.x, d.y, d.size, 0, Math.PI * 2)
      ctx!.fillStyle = isDark()
        ? `rgba(255, 255, 255, ${d.opacity})`
        : `rgba(30, 60, 160, ${d.opacity * 0.6})`
      ctx!.fill()
    }

    function draw() {
      const c = ctx!
      const dark = isDark()
      const w = canvas!.width
      const h = canvas!.height
      c.clearRect(0, 0, w, h)

      for (const b of blobs) drawBlob(b, dark)
      for (const g of geometries) drawGeo(g, dark)
      for (const d of dust) drawDust(d, w, h)

      // subtle noise overlay
      c.save()
      c.globalAlpha = dark ? 0.02 : 0.015
      c.fillStyle = noisePattern
      c.fillRect(0, 0, w, h)
      c.restore()

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
