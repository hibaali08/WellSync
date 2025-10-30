"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle, Sparkles, BarChart3, Home, Brain, Calendar, Moon } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="w-full bg-white/40 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold text-primary hidden sm:inline">WellSync</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </Link>

            <Link
              href="/chat"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/chat")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Chat</span>
            </Link>

            <Link
              href="/chat-analyzer"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/chat-analyzer")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Analyzer</span>
            </Link>

            <Link
              href="/quiz"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/quiz")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Quiz</span>
            </Link>

            <Link
              href="/scheduler"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/scheduler")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Schedule</span>
            </Link>

            <Link
              href="/reflection"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/reflection")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Reflect</span>
            </Link>

            <Link
              href="/insights"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive("/insights")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:text-foreground hover:bg-secondary/10"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Insights</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
