"use client"

import { motion } from "framer-motion"
import { WalletDashboard } from "@/components/wallet/WalletDashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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
  { label: "Total Volume", value: "2.4M XLM", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Active Projects", value: "1,284", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { label: "Freelancers", value: "8,500+", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { label: "Completed", value: "94.2%", icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
]

export default function DashboardPage() {
  const { data: projectCount, isLoading: countLoading } = useGetProjectCount()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-8">

        <FadeUp className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Live · Stellar Testnet</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Your wallet, network stats, and analytics at a glance</p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <StaggerItem key={s.label}>
              <div className="rounded-2xl p-5 border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] card-border-glow hover:shadow-lg dark:hover:shadow-blue-500/5 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <span className="text-xs text-gray-400 dark:text-gray-500">30d</span>
                </div>
                <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{s.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeUp>
            <WalletDashboard />
          </FadeUp>

          <FadeUp>
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
                  <Coins className="h-4 w-4 text-blue-500" />
                  Contract Info
                </CardTitle>
                <CardDescription>Stellar Testnet smart contract details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Total Projects", value: countLoading ? <Skeleton className="h-4 w-20" /> : <span className="font-semibold text-blue-600 dark:text-blue-400">{projectCount ?? 0}</span> },
                  { label: "Network", value: <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Testnet</span> },
                  { label: "RPC Endpoint", value: <code className="text-xs text-gray-400 dark:text-gray-500">soroban-testnet.stellar.org</code> },
                  { label: "Block Time", value: <span className="font-semibold text-cyan-600 dark:text-cyan-400">~5 seconds</span> },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                  >
                    <span className="text-gray-400 dark:text-gray-500">{item.label}</span>
                    {item.value}
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </FadeUp>
        </div>

        <FadeUp>
          <div className="flex items-center gap-3 pt-4">
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3">Analytics & Statistics</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6">
          <ScaleIn>
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
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
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
                  <BarChart2 className="h-4 w-4 text-emerald-500" />
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
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
                  <PieChartIcon className="h-4 w-4 text-purple-500" />
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
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
                  <ChartNetwork className="h-4 w-4 text-cyan-500" />
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
            <Card className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0f1117] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base text-gray-900 dark:text-white">
                  <LineChart className="h-4 w-4 text-cyan-500" />
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
          <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-[#0f1117] shadow-sm">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Ready to create a project?</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Set up milestone-based contracts and hire top freelancers.</p>
            </div>
            <a href="/app-page">
              <motion.button
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Zap className="h-4 w-4" />
                Create Project
              </motion.button>
            </a>
          </div>
        </ScaleIn>

      </div>
    </div>
  )
}
