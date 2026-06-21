"use client"

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts"

const volumeData = [
  { month: "Jan", volume: 42000, txns: 310 },
  { month: "Feb", volume: 58000, txns: 420 },
  { month: "Mar", volume: 47000, txns: 380 },
  { month: "Apr", volume: 73000, txns: 530 },
  { month: "May", volume: 91000, txns: 660 },
  { month: "Jun", volume: 88000, txns: 710 },
  { month: "Jul", volume: 110000, txns: 820 },
]

const milestoneData = [
  { week: "W1", completed: 34, pending: 12, disputed: 2 },
  { week: "W2", completed: 45, pending: 9, disputed: 1 },
  { week: "W3", completed: 38, pending: 14, disputed: 3 },
  { week: "W4", completed: 62, pending: 7, disputed: 1 },
  { week: "W5", completed: 71, pending: 11, disputed: 2 },
  { week: "W6", completed: 58, pending: 6, disputed: 0 },
]

const categoryData = [
  { name: "Development", value: 38 },
  { name: "Design", value: 24 },
  { name: "Writing", value: 18 },
  { name: "Marketing", value: 12 },
  { name: "Other", value: 8 },
]

const skillData = [
  { skill: "React", score: 85 },
  { skill: "Solidity", score: 72 },
  { skill: "Design", score: 68 },
  { skill: "Python", score: 90 },
  { skill: "Rust", score: 55 },
  { skill: "DevOps", score: 78 },
]

const CHART_COLORS = {
  blue: "#60a5fa",
  purple: "#a78bfa",
  cyan: "#22d3ee",
  emerald: "#34d399",
  orange: "#fb923c",
  pink: "#f472b6",
}

const PIE_COLORS = [
  CHART_COLORS.blue, CHART_COLORS.purple,
  CHART_COLORS.cyan, CHART_COLORS.emerald, CHART_COLORS.orange,
]

const gridColor = "rgba(255,255,255,0.06)"
const tickColor = "#94A3B8"

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-sm">
        <p className="text-muted-foreground mb-1 font-medium">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name}: {typeof p.value === "number" && p.value > 1000
              ? `${(p.value / 1000).toFixed(1)}K`
              : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function VolumeAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={volumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="txnGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={CHART_COLORS.purple} stopOpacity={0.3} />
            <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="volume" name="Volume (XLM)" stroke={CHART_COLORS.blue} strokeWidth={2} fill="url(#volumeGrad)" />
        <Area type="monotone" dataKey="txns" name="Transactions" stroke={CHART_COLORS.purple} strokeWidth={2} fill="url(#txnGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function MilestoneBarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={milestoneData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={3}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="week" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: "12px", color: tickColor }} />
        <Bar dataKey="completed" name="Completed" fill={CHART_COLORS.emerald} radius={[4, 4, 0, 0]} />
        <Bar dataKey="pending" name="Pending" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
        <Bar dataKey="disputed" name="Disputed" fill={CHART_COLORS.orange} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function CategoryPieChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {categoryData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0]
              return (
                <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-2xl text-sm">
                  <p style={{ color: d.payload.fill ?? "#fff" }} className="font-semibold">{d.name}: {d.value}%</p>
                </div>
              )
            }
            return null
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", color: tickColor }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function SkillRadarChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={skillData}>
        <PolarGrid stroke={gridColor} />
        <PolarAngleAxis dataKey="skill" tick={{ fill: tickColor, fontSize: 11 }} />
        <Radar name="Score" dataKey="score" stroke={CHART_COLORS.cyan} fill={CHART_COLORS.cyan} fillOpacity={0.2} strokeWidth={2} />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export function TxnLineChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={volumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="txns" name="Transactions" stroke={CHART_COLORS.cyan} strokeWidth={2.5} dot={{ fill: CHART_COLORS.cyan, r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
