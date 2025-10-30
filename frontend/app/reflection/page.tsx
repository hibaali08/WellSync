"use client"

import { useState } from "react"
import { Sun, Moon, TrendingUp, CheckCircle2, Loader2 } from "lucide-react"

interface ReflectionResult {
  morningMood: string
  eveningMood: string
  moodChange: number
  moodTrend: "improved" | "declined" | "stable"
  insights: string[]
  suggestion: string
}

function analyzeReflection(morningMood: string, eveningText: string): ReflectionResult {
  const lowerText = eveningText.toLowerCase()

  // Determine evening mood from keywords
  const happyKeywords = ["happy", "great", "wonderful", "amazing", "excited", "positive", "good", "love", "proud"]
  const tiredKeywords = ["tired", "exhausted", "fatigue", "drained", "sleepy", "worn out"]
  const stressKeywords = ["stress", "anxious", "worried", "overwhelmed", "pressure", "tense", "frustrated"]
  const calmKeywords = ["calm", "peaceful", "relaxed", "serene", "tranquil", "mindful"]

  let eveningMood = "Neutral"
  let moodScore = 50

  if (happyKeywords.some((keyword) => lowerText.includes(keyword))) {
    eveningMood = "Happy & Positive"
    moodScore = 85
  } else if (stressKeywords.some((keyword) => lowerText.includes(keyword))) {
    eveningMood = "Stressed & Anxious"
    moodScore = 35
  } else if (tiredKeywords.some((keyword) => lowerText.includes(keyword))) {
    eveningMood = "Tired & Fatigued"
    moodScore = 40
  } else if (calmKeywords.some((keyword) => lowerText.includes(keyword))) {
    eveningMood = "Calm & Peaceful"
    moodScore = 75
  }

  // Map morning mood to score
  const morningScores: Record<string, number> = {
    "Happy & Positive": 85,
    "Calm & Peaceful": 75,
    Neutral: 50,
    "Tired & Fatigued": 40,
    "Stressed & Anxious": 35,
  }

  const morningScore = morningScores[morningMood] || 50
  const moodChange = moodScore - morningScore

  let moodTrend: "improved" | "declined" | "stable" = "stable"
  if (moodChange > 10) moodTrend = "improved"
  else if (moodChange < -10) moodTrend = "declined"

  // Generate insights
  const insights: string[] = []

  if (lowerText.includes("accomplished") || lowerText.includes("completed")) {
    insights.push("You had a productive day - celebrate your wins!")
  }
  if (lowerText.includes("challenge") || lowerText.includes("difficult")) {
    insights.push("You faced challenges today - that shows resilience")
  }
  if (lowerText.includes("learn") || lowerText.includes("growth")) {
    insights.push("You're focused on growth - keep that mindset!")
  }
  if (lowerText.includes("social") || lowerText.includes("friend") || lowerText.includes("family")) {
    insights.push("You valued connections today - relationships matter")
  }
  if (lowerText.includes("rest") || lowerText.includes("break")) {
    insights.push("You prioritized self-care - that's important")
  }

  if (insights.length === 0) {
    insights.push("Every day is a step forward in your wellness journey")
  }

  // Generate suggestion
  let suggestion = "Reflect on today's experiences and plan for tomorrow."

  if (moodTrend === "improved") {
    suggestion =
      "Your mood improved today - great work! Identify what helped and try to repeat it tomorrow. You're building positive momentum."
  } else if (moodTrend === "declined") {
    suggestion =
      "Your mood shifted today. That's okay - tomorrow is a fresh start. Consider what you need more of: rest, support, or a change of pace."
  } else {
    suggestion =
      "Your mood stayed consistent today. Use this stability as a foundation to build on. Small positive changes can create big shifts."
  }

  return {
    morningMood,
    eveningMood,
    moodChange,
    moodTrend,
    insights,
    suggestion,
  }
}

export default function ReflectionPage() {
  const [morningMood, setMorningMood] = useState("")
  const [eveningText, setEveningText] = useState("")
  const [result, setResult] = useState<ReflectionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const moodOptions = ["Happy & Positive", "Calm & Peaceful", "Neutral", "Tired & Fatigued", "Stressed & Anxious"]

  const handleAnalyze = async () => {
    if (!morningMood || !eveningText.trim()) {
      setError("Please select your morning mood and describe your evening")
      return
    }
  
    setError("")
    setIsLoading(true)
    setResult(null)
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reflection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          morning_mood: morningMood,
          evening_text: eveningText,
        }),
      })
  
      if (!response.ok) throw new Error("Failed to analyze reflection")
  
      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error("Reflection API Error:", err)
      setError("Unable to analyze your reflection. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  

  const getMoodColor = (mood?: string): string => {
    if (!mood) return "text-primary"
    const moodLower = mood.toLowerCase()
    if (moodLower.includes("happy") || moodLower.includes("positive")) return "text-green-600"
    if (moodLower.includes("tired") || moodLower.includes("fatigued")) return "text-blue-600"
    if (moodLower.includes("stressed") || moodLower.includes("anxious")) return "text-orange-600"
    if (moodLower.includes("calm") || moodLower.includes("peaceful")) return "text-emerald-600"
    return "text-primary"
  }
  

  const getMoodBgColor = (mood?: string): string => {
    if (!mood) return "bg-primary/5"
    const moodLower = mood.toLowerCase()
    if (moodLower.includes("happy") || moodLower.includes("positive")) return "bg-green-50"
    if (moodLower.includes("tired") || moodLower.includes("fatigued")) return "bg-blue-50"
    if (moodLower.includes("stressed") || moodLower.includes("anxious")) return "bg-orange-50"
    if (moodLower.includes("calm") || moodLower.includes("peaceful")) return "bg-emerald-50"
    return "bg-primary/5"
  }
  

  return (
    <main className="min-h-screen bg-gradient-wellsync flex flex-col">
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Moon className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">End-of-Day Reflection</h1>
          </div>
          <p className="text-foreground/60">Compare your mood from this morning and reflect on your day</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 mb-6 shadow-sm space-y-6">
          {/* Morning Mood Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sun className="w-4 h-4 text-accent" />
              How did you feel this morning?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setMorningMood(mood)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    morningMood === mood
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-input text-foreground hover:bg-secondary/10 border border-border"
                  }`}
                  disabled={isLoading}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Evening Reflection */}
          <div>
            <label
              htmlFor="evening"
              className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2"
            >
              <Moon className="w-4 h-4 text-primary" />
              How was your day? Tell us about your evening
            </label>
            <textarea
              id="evening"
              value={eveningText}
              onChange={(e) => setEveningText(e.target.value)}
              placeholder="Share how your day went, what you accomplished, challenges you faced, or how you're feeling now..."
              className="w-full h-32 sm:h-40 px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-sans"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !morningMood || !eveningText.trim()}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  Compare Moods
                </>
              )}
            </button>
            <button
              onClick={() => {
                setMorningMood("")
                setEveningText("")
                setResult(null)
                setError("")
              }}
              disabled={isLoading}
              className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 disabled:opacity-50 text-foreground font-semibold rounded-lg transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Mood Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-5 h-5 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground/70">Morning Mood</h3>
                </div>
                <p className={`text-xl font-bold ${getMoodColor(result.morningMood)}`}>{result.morningMood}</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground/70">Evening Mood</h3>
                </div>
                <p className={`text-xl font-bold ${getMoodColor(result.eveningMood)}`}>{result.eveningMood}</p>
              </div>
            </div>

            {/* Mood Change */}
            <div
              className={`${getMoodBgColor(result.eveningMood)} rounded-2xl border border-border p-6 sm:p-8 shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <TrendingUp className={`w-8 h-8 ${getMoodColor(result.eveningMood)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground/70 mb-2">Mood Trend</h3>
                  <p className="text-lg font-bold text-foreground mb-2">
                    {result.moodTrend === "improved"
                      ? "Your mood improved"
                      : result.moodTrend === "declined"
                        ? "Your mood shifted"
                        : "Your mood remained stable"}
                  </p>
                  <p className="text-foreground/80">
                    {result.moodChange > 0 ? "+" : ""}
                    {result.moodChange} points from this morning
                  </p>
                </div>
              </div>
            </div>

            {/* Insights */}
            {result.insights.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground/70 mb-4">Today's Insights</h3>
                <div className="space-y-2">
                  {result.insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion */}
            <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl border border-accent/20 p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground/70 mb-3">Tomorrow's Intention</h3>
              <p className="text-foreground leading-relaxed">{result.suggestion}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setMorningMood("")
                  setEveningText("")
                  setResult(null)
                }}
                className="flex-1 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-lg transition-all duration-200"
              >
                New Reflection
              </button>
              <button className="flex-1 px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-foreground font-semibold rounded-lg transition-all duration-200">
                Save to Insights
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Moon className="w-8 h-8 text-primary/60" />
              </div>
              <p className="text-foreground/60 text-lg">Reflect on your day to get started</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
