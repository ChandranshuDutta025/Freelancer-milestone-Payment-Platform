import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Wallet, ListChecks, Activity, ShieldCheck, Zap, Globe,
  TrendingUp, Users, ArrowRight, CheckCircle, Star
} from "lucide-react"

export default function Home() {
  const stats = [
    { label: "Total Volume", value: "2.4M XLM", icon: TrendingUp, color: "text-blue-400" },
    { label: "Active Projects", value: "1,284", icon: ListChecks, color: "text-purple-400" },
    { label: "Freelancers", value: "8,500+", icon: Users, color: "text-cyan-400" },
    { label: "Avg. Settlement", value: "< 5 sec", icon: Zap, color: "text-emerald-400" },
  ]

  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Milestone Escrow",
      desc: "Funds are locked in smart contracts and released only upon milestone approval — trustless by design.",
      gradient: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
      border: "border-blue-500/20",
    },
    {
      icon: Globe,
      title: "Stellar-Powered",
      desc: "Ultra-fast, low-cost transactions with global reach. Sub-5 second finality on Stellar blockchain.",
      gradient: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400",
      border: "border-purple-500/20",
    },
    {
      icon: Activity,
      title: "Real-Time Tracking",
      desc: "Live dashboards with charts and analytics — monitor projects, milestones, and payments in real time.",
      gradient: "from-cyan-500/20 to-cyan-600/5",
      iconColor: "text-cyan-400",
      border: "border-cyan-500/20",
    },
  ]

  const steps = [
    { step: "01", title: "Create Project", desc: "Define milestones, scope, and budget on-chain", icon: ListChecks },
    { step: "02", title: "Hire Freelancer", desc: "Accept proposals from verified freelancers", icon: Users },
    { step: "03", title: "Track Progress", desc: "Review and approve completed milestones", icon: CheckCircle },
    { step: "04", title: "Get Paid", desc: "Automated XLM release on approval", icon: Zap },
  ]

  return (
    <div className="hero-gradient grid-bg min-h-screen">
      {/* ── Hero ── */}
      <section className="relative container mx-auto px-4 md:px-6 pt-20 pb-16 text-center overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[200px] h-[200px] bg-purple-500/8 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm text-blue-300 mb-6 font-medium">
            <span className="pulse-dot" />
            Live on Stellar Testnet
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Freelance Payments,{" "}
            <span className="gradient-text text-glow block md:inline">
              Reimagined
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Secure, milestone-based payments between clients and freelancers —
            powered by Stellar smart contracts with <strong className="text-foreground">zero trust required</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up-delay-1">
            <Link href="/app-page">
              <Button size="lg" className="gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 py-6 text-base font-semibold rounded-xl glow-blue-sm transition-all hover:scale-105">
                <ListChecks className="h-5 w-5" />
                Launch App
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="gap-2 border-border/60 hover:border-blue-500/50 hover:bg-blue-500/5 px-8 py-6 text-base rounded-xl transition-all hover:scale-105">
                <Wallet className="h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-10 flex items-center justify-center gap-1 text-sm text-muted-foreground fade-in-up-delay-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-2">Trusted by <strong className="text-foreground">8,500+</strong> freelancers worldwide</span>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="container mx-auto px-4 md:px-6 py-6 fade-in-up-delay-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-5 stat-card text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <div className={`text-2xl font-bold ${stat.color} font-mono`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-3">Why Choose Us</div>
          <h2 className="text-3xl md:text-4xl font-bold">Built for the future of work</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`glass-card rounded-2xl p-7 stat-card border ${f.border} bg-gradient-to-br ${f.gradient}`}
            >
              <div className={`h-12 w-12 rounded-xl bg-current/10 flex items-center justify-center mb-5 ${f.iconColor}`}
                style={{ backgroundColor: "hsl(var(--accent))" }}>
                <f.icon className={`h-6 w-6 ${f.iconColor}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-purple-400 uppercase tracking-widest mb-3">Simple Process</div>
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4 relative">
          {/* connecting line */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
          {steps.map((item, idx) => (
            <div key={item.step} className="text-center space-y-4 relative">
              <div className={`h-16 w-16 rounded-2xl mx-auto flex items-center justify-center text-sm font-mono font-bold border
                ${idx === 0 ? "bg-blue-500/20 border-blue-500/40 text-blue-400" :
                  idx === 1 ? "bg-purple-500/20 border-purple-500/40 text-purple-400" :
                  idx === 2 ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" :
                  "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"}`}>
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 md:px-6 py-16 pb-24">
        <div className="glass-card rounded-3xl p-10 md:p-16 text-center border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5 relative overflow-hidden glow-blue">
          <div className="absolute inset-0 shimmer pointer-events-none rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
              Connect your Stellar wallet and create your first milestone project in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/app-page">
                <Button size="lg" className="gap-2 bg-blue-500 hover:bg-blue-400 text-white px-10 py-6 text-base font-semibold rounded-xl transition-all hover:scale-105">
                  <ListChecks className="h-5 w-5" />
                  Create Your First Project
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="gap-2 border-blue-500/40 hover:border-blue-500 px-10 py-6 text-base rounded-xl transition-all hover:scale-105">
                  <Wallet className="h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
