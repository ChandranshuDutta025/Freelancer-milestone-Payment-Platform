import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "sonner"
import { QueryProvider } from "./query-provider"
import { PageTransitionProvider } from "./page-transition"
import { MouseFollower } from "@/components/ui/MouseFollower"
import { AnimatedBackground } from "@/components/ui/AnimatedBackground"
import { StoreProvider } from "@/components/StoreProvider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Freelancer Milestone Payment - Stellar DApp",
  description:
    "Decentralized milestone-based payment platform for freelancers on the Stellar network.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <StoreProvider>
            <AnimatedBackground />
            <MouseFollower />
            <div className="flex min-h-screen flex-col relative z-10">
              <Navbar />
              <main className="flex-1 pt-16">
                <PageTransitionProvider>{children}</PageTransitionProvider>
              </main>
              <Footer />
            </div>
            <Toaster richColors closeButton />
            </StoreProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
