"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-500/15 text-blue-400 shadow-sm",
        secondary:
          "border-transparent bg-white/5 text-muted-foreground backdrop-blur-sm",
        destructive:
          "border-transparent bg-red-500/15 text-red-400 shadow-sm",
        outline: "border-white/10 text-foreground bg-white/[0.03] backdrop-blur-sm",
        success:
          "border-transparent bg-emerald-500/15 text-emerald-400 shadow-sm",
        warning:
          "border-transparent bg-amber-500/15 text-amber-400 shadow-sm",
        premium:
          "border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-transparent bg-clip-text gradient-text shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
