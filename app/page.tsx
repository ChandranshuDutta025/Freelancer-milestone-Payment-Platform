"use client"

import Link from "next/link"
import { motion, useMotionValue, useSpring, animate, useInView } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Wallet, ListChecks, ShieldCheck, Globe, Activity,
  TrendingUp, Users, ArrowRight,
} from "lucide-react"
import {
  FadeUp, StaggerContainer, StaggerItem, ScaleIn,
} from "@/components/ui/motion"

/* ───── helpers ───── */

function MagneticButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current?.getBoundingClientRect()
    if (!el) return
    const cx = el.left + el.width / 2
    const cy = el.top + el.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = 150
    const factor = Math.max(0, 1 - dist / maxDist) * 8
    x.set(dx * 0.12 * factor / 8)
    y.set(dy * 0.12 * factor / 8)
  }, [x, y])

  const onMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block"
    >
      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
        <Button className={className} {...props} />
      </motion.div>
    </motion.div>
  )
}

function CountUp({ from = 0, to, suffix = "", duration = 2, delay = 0.3 }: { from?: number; to: number; suffix?: string; duration?: number; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [val, setVal] = useState(from)

  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => {
      const controls = animate(from, to, {
        duration,
        ease: [0.25, 0.1, 0.25, 1] as const,
        onUpdate: (v) => setVal(Math.round(v)),
      })
      return () => controls.stop()
    }, delay * 1000)
    return () => clearTimeout(t)
  }, [inView, from, to, duration, delay])

  return <span ref={ref}>{val}{suffix}</span>
}

function useMouseGlow() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 25 })
  const springY = useSpring(y, { stiffness: 150, damping: 25 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [x, y])

  return { x: springX, y: springY }
}

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sX = useSpring(rotX, { stiffness: 200, damping: 25 })
  const sY = useSpring(rotY, { stiffness: 200, damping: 25 })

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current?.getBoundingClientRect()
    if (!el) return
    const px = (e.clientX - el.left) / el.width
    const py = (e.clientY - el.top) / el.height
    rotY.set((px - 0.5) * 6)
    rotX.set((0.5 - py) * 6)
  }, [rotX, rotY])

  const onLeave = useCallback(() => {
    rotX.set(0); rotY.set(0)
  }, [rotX, rotY])

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 800, rotateX: sX, rotateY: sY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ───── data ───── */

const stats = [
  { label: "Total Volume", value: 2400000, suffix: " XLM", icon: TrendingUp, accent: "from-blue-500/20 to-blue-500/5" },
  { label: "Active Projects", value: 1284, suffix: "", icon: ListChecks, accent: "from-purple-500/20 to-purple-500/5" },
  { label: "Freelancers", value: 8500, suffix: "+", icon: Users, accent: "from-cyan-500/20 to-cyan-500/5" },
  { label: "Avg. Settlement", value: 5, suffix: " sec", icon: Activity, accent: "from-emerald-500/20 to-emerald-500/5" },
]

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Milestone Escrow",
    desc: "Funds are locked in smart contracts and released only upon milestone approval — trustless by design.",
  },
  {
    icon: Globe,
    title: "Stellar-Powered",
    desc: "Ultra-fast, low-cost transactions with global reach. Sub-5 second finality on Stellar blockchain.",
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    desc: "Live dashboards with charts and analytics — monitor projects, milestones, and payments in real time.",
  },
]

const steps = [
  { step: "01", title: "Create Project", desc: "Define milestones, scope, and budget on-chain" },
  { step: "02", title: "Hire Freelancer", desc: "Accept proposals from verified freelancers" },
  { step: "03", title: "Track Progress", desc: "Review and approve completed milestones" },
  { step: "04", title: "Get Paid", desc: "Automated XLM release on approval" },
]

const logos = [
  "Stellar", "Freelancer", "Upwork", "Fiverr", "Toptal",
  "Stellar", "Freelancer", "Upwork", "Fiverr", "Toptal",
]

const headlineWords = ["Freelance", "Payments", "Reimagined"]

/* ───── page ───── */

export default function Home() {
  const glow = useMouseGlow()
  const [stepProgress, setStepProgress] = useState(0)
  const stepsRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const el = stepsRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      setStepProgress(progress)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docH > 0 ? window.scrollY / docH : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] overflow-hidden">

      {/* ── Scroll progress ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/40 to-purple-500/40 z-50 origin-left pointer-events-none"
        style={{ scaleX: scrollProgress }}
      />

      {/* ── Orb + Mesh Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] animate-orb-morph bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent blur-3xl" />
        <div className="absolute top-[15%] right-[10%] w-[400px] h-[400px] animate-orb-morph-delayed bg-gradient-to-bl from-purple-500/8 via-blue-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] animate-float-slower bg-gradient-to-tr from-blue-500/8 to-transparent blur-3xl" />
        <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] animate-float-slow bg-gradient-to-bl from-purple-500/6 to-transparent blur-3xl" />

        {/* Mouse glow */}
        <motion.div
          className="hidden md:block absolute left-0 top-0"
          style={{ x: glow.x, y: glow.y }}
        >
          <div className="h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/6 via-purple-500/3 to-transparent blur-3xl" />
        </motion.div>
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-12 md:pt-40 md:pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm text-blue-400 mb-8 font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Live on Stellar Testnet
          </motion.div>

          {/* Animated words */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: [0.25, 0.1, 0.25, 1] as const }}
              >
                {word === "Reimagined" ? (
                  <span className="gradient-text-premium">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Secure, milestone-based payments between clients and freelancers —
            powered by Stellar smart contracts with{" "}
            <span className="font-semibold text-white">zero trust required</span>.
          </motion.p>

          {/* Magnetic Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/app-page">
              <MagneticButton variant="gradient" className="gap-2 text-white px-8 py-6 text-base font-semibold rounded-xl">
                <ListChecks className="h-5 w-5" />
                Launch App
                <ArrowRight className="h-4 w-4 ml-1" />
              </MagneticButton>
            </Link>
            <Link href="/dashboard">
              <MagneticButton variant="outline" className="gap-2 border-white/10 text-muted-foreground hover:text-white hover:bg-white/[0.06] px-8 py-6 text-base rounded-xl">
                <Wallet className="h-5 w-5" />
                View Dashboard
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex -space-x-2">
            {["JD", "AK", "ML", "SR"].map((initials, i) => (
              <motion.div
                key={i}
                className="h-8 w-8 rounded-full border-2 border-[#030712] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y: [0, -2, 0] }}
                transition={{
                  duration: 0.3, delay: 0.9 + i * 0.05,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                }}
              >
                {initials}
              </motion.div>
            ))}
            <motion.div
              className="h-8 w-8 rounded-full border-2 border-[#030712] bg-white/[0.06] flex items-center justify-center text-[10px] font-semibold text-muted-foreground shadow-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.1 }}
            >
              +2k
            </motion.div>
          </div>
          <span>Trusted by <strong className="text-white">8,500+</strong> freelancers worldwide</span>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden shadow-sm border border-white/[0.06]">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label}>
              <div className="glass-card p-6 md:p-8 text-center h-full flex flex-col items-center justify-center border-0 rounded-none">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.accent} mb-2`}>
                  <stat.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight">
                  <CountUp from={0} to={stat.value} suffix={stat.suffix} delay={0.2 + i * 0.1} />
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR (marquee logos) ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <FadeUp className="text-center mb-8">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.15em]">
            Trusted by leading platforms
          </div>
        </FadeUp>
        <div className="overflow-hidden">
          <motion.div className="flex gap-16 animate-marquee w-max">
            {logos.map((name, i) => (
              <div key={i} className="flex-shrink-0 h-8 flex items-center">
                <span className="text-sm font-semibold text-white/20 tracking-widest uppercase">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <FadeUp className="text-center mb-16">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-[0.15em] mb-4">Why Choose Us</div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Built for the future of work</h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Every feature designed to make freelance payments secure, fast, and transparent.
          </p>
        </FadeUp>
        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <TiltCard>
                <motion.div
                  className="group glass-card rounded-2xl p-8 glass-card-hover"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
                >
                  <motion.div
                    className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-5 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <f.icon className="h-5 w-5 text-blue-400" />
                  </motion.div>
                  <h3 className="font-semibold text-lg text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={stepsRef} className="relative z-10 bg-white/[0.02] border-y border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <FadeUp className="text-center mb-16">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-[0.15em] mb-4">Simple Process</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Four simple steps to get your first project up and running.
            </p>
          </FadeUp>

          <div className="relative">
            {/* Animated connecting line */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${Math.min(100, stepProgress * 100)}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-6 md:gap-8">
              {steps.map((item) => (
                <FadeUp key={item.step}>
                  <motion.div
                    className="text-center group"
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <motion.div
                      className="h-14 w-14 rounded-xl glass-card flex items-center justify-center mx-auto mb-5 text-sm font-bold gradient-text group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-all duration-300"
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      {item.step}
                    </motion.div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1.5">{item.desc}</p>
                  </motion.div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <ScaleIn>
          <motion.div
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden glass-card gradient-border"
            whileHover={{ boxShadow: "0 20px 60px -15px rgba(96, 165, 250, 0.15)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Connect your Stellar wallet and create your first milestone project in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/app-page" className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <MagneticButton variant="gradient" className="relative gap-2 text-white px-10 py-6 text-base font-semibold rounded-xl">
                    <ListChecks className="h-5 w-5" />
                    Create Your First Project
                  </MagneticButton>
                </Link>
                <Link href="/dashboard">
                  <MagneticButton variant="outline" className="gap-2 border-white/10 text-muted-foreground hover:text-white hover:bg-white/[0.06] px-10 py-6 text-base rounded-xl">
                    <Wallet className="h-5 w-5" />
                    Dashboard
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </motion.div>
        </ScaleIn>
      </section>
    </div>
  )
}
