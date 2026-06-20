import { Zap, GitBranch, AtSign, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/70 backdrop-blur-xl py-8 md:py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="font-semibold gradient-text text-sm">FreelancerPay</span>
          </div>

          {/* Center */}
          <p className="text-xs text-muted-foreground text-center">
            Built on{" "}
            <a
              href="https://stellar.org"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
            >
              Stellar
            </a>
            {" "}network · Decentralized milestone payments · {new Date().getFullYear()}
          </p>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a href="#" className="h-8 w-8 rounded-lg bg-accent/50 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-500/40 transition-all">
              <GitBranch className="h-3.5 w-3.5" />
            </a>
            <a href="#" className="h-8 w-8 rounded-lg bg-accent/50 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-500/40 transition-all">
              <AtSign className="h-3.5 w-3.5" />
            </a>
            <a href="https://stellar.org" target="_blank" rel="noreferrer" className="h-8 w-8 rounded-lg bg-accent/50 border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-500/40 transition-all">
              <Globe className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
