"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Wallet, Menu, X, LayoutDashboard, ListTodo, Activity, History, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/app-page", label: "App", icon: ListTodo },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/transactions", label: "Transactions", icon: History },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group">
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Zap className="h-4 w-4 text-blue-400" />
            </div>
            <span className="hidden sm:inline gradient-text">FreelancerPay</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className={`gap-2 rounded-lg text-sm transition-all ${
                    pathname === link.href
                      ? "bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <link.icon className="h-3.5 w-3.5" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <WalletConnectButton />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl p-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              <Button
                variant={pathname === link.href ? "secondary" : "ghost"}
                className={`w-full justify-start gap-2 ${
                  pathname === link.href
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="pt-2">
            <WalletConnectButton />
          </div>
        </div>
      )}
    </header>
  )
}
