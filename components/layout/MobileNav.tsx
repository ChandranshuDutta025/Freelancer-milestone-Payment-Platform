"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { useWallet } from "@/hooks/useWallet"
import { truncateAddress } from "@/lib/utils"
import {
  Home,
  LayoutDashboard,
  Activity,
  ArrowLeftRight,
  X,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "App", icon: LayoutDashboard },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
]

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()
  const { address, isConnected } = useWallet()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex flex-col gap-0 p-0">
        <SheetHeader className="flex flex-row items-center justify-between border-b px-4 py-4">
          <SheetTitle className="text-lg font-bold">
            Freelancer Milestone
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>

        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          {isConnected && address ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Connected as</p>
              <p className="font-mono text-sm font-medium truncate">
                {truncateAddress(address, 6)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Wallet not connected
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
