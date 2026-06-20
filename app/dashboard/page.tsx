"use client"

import { WalletDashboard } from "@/components/wallet/WalletDashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetProjectCount } from "@/hooks/useContract"
import {
  Coins, TrendingUp, Activity, PieChartIcon,
  ChartNetwork, BarChart2, LineChart, Zap, Users, CheckCircle
} from "lucide-react"
import {
  VolumeAreaChart,
  MilestoneBarChart,
  CategoryPieChart,
  SkillRadarChart,
  TxnLineChart,
} from "@/components/ui/StatsCharts"

const statCards = [
  { label: "Total Volume", value: "2.4M XLM", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Active Projects", value: "1,284", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Freelancers", value: "8,500+", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { label: "Completed", value: "94.2%", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
]

export default function DashboardPage() {
  const { data: projectCount, isLoading: countLoading } = useGetProjectCount()

  return (
    <div className="hero-gradient min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span className="text-sm text-emerald-400 font-medium">Live · Stellar Testnet</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Your wallet, network stats, and analytics at a glance</p>
        </div>

        {/* ── Top stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className={`glass-card rounded-2xl p-5 stat-card border ${s.border} ${s.bg}`}>
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs text-muted-foreground">30d</span>
              </div>
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Wallet + Contract info ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <WalletDashboard />

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Coins className="h-4 w-4 text-blue-400" />
                Contract Info
              </CardTitle>
              <CardDescription>Stellar Testnet smart contract details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
                <span className="text-muted-foreground">Total Projects</span>
                {countLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="font-semibold text-blue-400">{projectCount ?? 0}</span>
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                  Testnet
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
                <span className="text-muted-foreground">RPC Endpoint</span>
                <code className="text-xs text-muted-foreground">soroban-testnet.stellar.org</code>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
                <span className="text-muted-foreground">Block Time</span>
                <span className="font-semibold text-cyan-400">~5 seconds</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Charts Section Header ── */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-px flex-1 bg-border/40" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest px-3">Analytics & Statistics</span>
          <div className="h-px flex-1 bg-border/40" />
        </div>

        {/* ── Chart Row 1: Area + Bar ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Payment Volume & Transactions
              </CardTitle>
              <CardDescription>Monthly overview — XLM volume & transaction count</CardDescription>
            </CardHeader>
            <CardContent>
              <VolumeAreaChart />
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart2 className="h-4 w-4 text-emerald-400" />
                Milestone Status
              </CardTitle>
              <CardDescription>Weekly milestone completion breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <MilestoneBarChart />
            </CardContent>
          </Card>
        </div>

        {/* ── Chart Row 2: Pie + Radar + Line ── */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChartIcon className="h-4 w-4 text-purple-400" />
                Project Categories
              </CardTitle>
              <CardDescription>Distribution by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPieChart />
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ChartNetwork className="h-4 w-4 text-cyan-400" />
                Top Skills
              </CardTitle>
              <CardDescription>Most in-demand freelancer skills</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillRadarChart />
            </CardContent>
          </Card>

          <Card className="glass-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <LineChart className="h-4 w-4 text-cyan-400" />
                Transaction Trend
              </CardTitle>
              <CardDescription>Daily transactions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <TxnLineChart />
            </CardContent>
          </Card>
        </div>

        {/* ── Quick Actions ── */}
        <div className="glass-card rounded-2xl border border-blue-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Ready to create a project?</h3>
            <p className="text-sm text-muted-foreground mt-1">Set up milestone-based contracts and hire top freelancers.</p>
          </div>
          <a href="/app-page">
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-all hover:scale-105 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Create Project
            </button>
          </a>
        </div>

      </div>
    </div>
  )
}
