"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle, Sparkles, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-wellsync flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Decorative element */}
          <div className="mb-8 flex justify-center">
            <div className="inline-block px-4 py-2 rounded-full bg-muted/30 border border-muted">
              <span className="text-sm font-medium text-primary">Welcome to your wellness journey</span>
            </div>
          </div>

          {/* Main tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
            Your Path to Calm, Clarity & Care 🌿
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-foreground/70 mb-12 leading-relaxed text-balance">
            Supporting your mental wellness through friendly chats, mood quizzes, and emotional insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-lg transition-all hover:shadow-lg w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-secondary text-secondary hover:bg-secondary/10 font-semibold px-8 py-6 text-base rounded-lg transition-all bg-transparent w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Take a Quiz
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Friendly Chat</h3>
              <p className="text-sm text-foreground/60">Talk to our AI companion anytime</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Mood Quizzes</h3>
              <p className="text-sm text-foreground/60">Understand your emotional patterns</p>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Insights</h3>
              <p className="text-sm text-foreground/60">Track your wellness progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-foreground/60">
          <p>WellSync © 2025. Your mental wellness companion.</p>
        </div>
      </footer>
    </main>
  )
}
