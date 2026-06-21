"use client"

import { motion } from "framer-motion"
import { WalletDashboard } from "@/components/wallet/WalletDashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useGetProjectCount } from "@/hooks/useContract"
import {
  Coins, TrendingUp, Activity, Users, CheckCircle,
  BarChart2, PieChartIcon, ChartNetwork, LineChart, Zap,
} from "lucide-react"
import {
  VolumeAreaChart,
  MilestoneBarChart,
  CategoryPieChart,
  SkillRadarChart,
  TxnLineChart,
} from "@/components/ui/StatsCharts"
import {
  StaggerContainer, StaggerItem, FadeUp, ScaleIn,
} from "@/components/ui/motion"

const statCards = [
  { label: "Total Volume", value: "2.4M XLM", icon: TrendingUp, color: "text-blue-400", accent: "from-blue-500/20 to-blue-500/5" },
  { label: "Active Projects", value: "1,284", icon: Activity, color: "text-purple-400", accent: "from-purple-500/20 to-purple-500/5" },
  { label: "Freelancers", value: "8,500+", icon: Users, color: "text-cyan-400", accent: "from-cyan-500/20 to-cyan-500/5" },
  { label: "Completed", value: "94.2%", icon: CheckCircle, color: "text-emerald-400", accent: "from-emerald-500/20 to-emerald-500/5" },
]

export default function DashboardPage() {
  const { data: projectCount, isLoading: countLoading } = useGetProjectCount()

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-8">

        <FadeUp className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-400 font-medium">Live · Stellar Testnet</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-muted-foreground">Your wallet, network stats, and analytics at a glance</p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <StaggerItem key={s.label}>
              <div className="glass-card rounded-2xl p-5 glass-card-hover">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${s.accent}`}>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <span className="text-xs text-muted-foreground">30d</span>
                </div>
                <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeUp>
            <WalletDashboard />
          </FadeUp>

          <FadeUp>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Coins className="h-4 w-4 text-blue-400" />
                  Contract Info
                </CardTitle>
                <CardDescription>Stellar Testnet smart contract details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Total Projects", value: countLoading ? <Skeleton className="h-4 w-20" /> : <span className="font-semibold text-blue-400">{projectCount ?? 0}</span> },
                  { label: "Network", value: <span className="font-semibold text-emerald-400 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Testnet</span> },
                  { label: "RPC Endpoint", value: <code className="text-xs text-muted-foreground">soroban-testnet.stellar.org</code> },
                  { label: "Block Time", value: <span className="font-semibold text-cyan-400">~5 seconds</span> },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    {item.value}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        <FadeUp>
          <div className="flex items-center gap-3 pt-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest px-3">Analytics & Statistics</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          <ScaleIn>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Payment Volume & Transactions
                </CardTitle>
                <CardDescription>Monthly overview — XLM volume & transaction count</CardDescription>
              </CardHeader>
              <CardContent>
                <VolumeAreaChart />
              </CardContent>
            </Card>
          </ScaleIn>

          <ScaleIn>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <BarChart2 className="h-4 w-4 text-emerald-400" />
                  Milestone Status
                </CardTitle>
                <CardDescription>Weekly milestone completion breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <MilestoneBarChart />
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ScaleIn>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <PieChartIcon className="h-4 w-4 text-purple-400" />
                  Project Categories
                </CardTitle>
                <CardDescription>Distribution by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryPieChart />
              </CardContent>
            </Card>
          </ScaleIn>

          <ScaleIn>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <ChartNetwork className="h-4 w-4 text-cyan-400" />
                  Top Skills
                </CardTitle>
                <CardDescription>Most in-demand freelancer skills</CardDescription>
              </CardHeader>
              <CardContent>
                <SkillRadarChart />
              </CardContent>
            </Card>
          </ScaleIn>

          <ScaleIn>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <LineChart className="h-4 w-4 text-cyan-400" />
                  Transaction Trend
                </CardTitle>
                <CardDescription>Daily transactions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <TxnLineChart />
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

        <ScaleIn>
          <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 gradient-border">
            <div>
              <h3 className="font-semibold text-lg text-white">Ready to create a project?</h3>
              <p className="text-sm text-muted-foreground mt-1">Set up milestone-based contracts and hire top freelancers.</p>
            </div>
            <a href="/app-page">
              <Button variant="gradient" size="lg" className="gap-2">
                <Zap className="h-4 w-4" />
                Create Project
              </Button>
            </a>
          </div>
        </ScaleIn>

      </div>
    </div>
  )
}
