"use client"

import { useState } from "react"
import { MessageCircle, Loader2, CheckCircle2, Lightbulb } from "lucide-react"
import axios from "axios"

interface AnalysisResult {
  mood: string
  confidence_score: number
  key_stress_factors: string[]
  motivational_suggestion: string
}

function analyzeEmotionLocally(text: string): AnalysisResult {
  const lowerText = text.toLowerCase()

  // Keyword detection for mood and stress factors
  const tiredKeywords = ["tired", "exhausted", "fatigue", "drained", "sleepy", "worn out"]
  const stressKeywords = ["stress", "anxious", "worried", "overwhelmed", "pressure", "tense", "frustrated"]
  const happyKeywords = ["happy", "great", "wonderful", "amazing", "excited", "positive", "good", "love"]
  const calmKeywords = ["calm", "peaceful", "relaxed", "serene", "tranquil", "mindful"]

  let mood = "Neutral"
  let confidence = 0.6

  if (tiredKeywords.some((keyword) => lowerText.includes(keyword))) {
    mood = "Tired & Fatigued"
    confidence = 0.85
  } else if (stressKeywords.some((keyword) => lowerText.includes(keyword))) {
    mood = "Stressed & Anxious"
    confidence = 0.9
  } else if (happyKeywords.some((keyword) => lowerText.includes(keyword))) {
    mood = "Happy & Positive"
    confidence = 0.88
  } else if (calmKeywords.some((keyword) => lowerText.includes(keyword))) {
    mood = "Calm & Peaceful"
    confidence = 0.82
  }

  // Determine stress factors based on keywords
  const stressFactors: string[] = []
  if (lowerText.includes("work") || lowerText.includes("job") || lowerText.includes("deadline"))
    stressFactors.push("Work-related pressure")
  if (lowerText.includes("sleep") || lowerText.includes("tired") || lowerText.includes("rest"))
    stressFactors.push("Insufficient rest")
  if (lowerText.includes("family") || lowerText.includes("relationship") || lowerText.includes("friend"))
    stressFactors.push("Relationship concerns")
  if (lowerText.includes("health") || lowerText.includes("sick") || lowerText.includes("pain"))
    stressFactors.push("Health concerns")
  if (lowerText.includes("money") || lowerText.includes("financial") || lowerText.includes("budget"))
    stressFactors.push("Financial worries")

  if (stressFactors.length === 0) {
    stressFactors.push("General daily challenges")
  }

  // Generate motivational suggestions based on mood
  let suggestion = "Remember to take care of yourself today. You're doing great!"

  if (mood === "Tired & Fatigued") {
    suggestion =
      "Your body is telling you it needs rest. Consider taking a short break, staying hydrated, and getting quality sleep tonight. You deserve to recharge."
  } else if (mood === "Stressed & Anxious") {
    suggestion =
      "Take a deep breath. Try a 5-minute meditation or a short walk to calm your mind. Breaking tasks into smaller steps can help reduce overwhelm."
  } else if (mood === "Happy & Positive") {
    suggestion =
      "That's wonderful! Keep riding this positive wave. Share your good energy with others and celebrate your wins, no matter how small."
  } else if (mood === "Calm & Peaceful") {
    suggestion =
      "You're in a great mental space. Use this moment to reflect, plan, or simply enjoy the peace. This is your foundation for a great day."
  }

  return {
    mood,
    confidence_score: confidence,
    key_stress_factors: stressFactors,
    motivational_suggestion: suggestion,
  }
}

export default function ChatAnalyzerPage() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError("Please share something about your day first")
      return
    }
  
    setError("")
    setIsLoading(true)
    setResult(null)
  
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-analyzer`, {
        text: input,
      })
  
      setResult(res.data)
    } catch (err) {
      console.error(err)
      setError("Unable to analyze your input. Make sure your backend is running on port 8000.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const getMoodColor = (mood: string): string => {
    const moodLower = mood.toLowerCase()
    if (moodLower.includes("happy") || moodLower.includes("positive")) return "text-green-600"
    if (moodLower.includes("tired") || moodLower.includes("fatigued")) return "text-blue-600"
    if (moodLower.includes("stressed") || moodLower.includes("anxious")) return "text-orange-600"
    if (moodLower.includes("calm") || moodLower.includes("peaceful")) return "text-emerald-600"
    return "text-primary"
  }

  const getMoodBgColor = (mood: string): string => {
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
              <MessageCircle className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Chat Analyzer</h1>
          </div>
          <p className="text-foreground/60">Describe your day, and we'll help you reflect on your emotions.</p>
        </div>

        {/* Input Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 mb-6 shadow-sm">
          <label htmlFor="diary" className="block text-sm font-semibold text-foreground mb-3">
            Tell us about your day
          </label>
          <textarea
            id="diary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share how your work went, what challenges you faced, or anything on your mind. Be as detailed as you'd like..."
            className="w-full h-32 sm:h-40 px-4 py-3 rounded-xl border border-border bg-input text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-sans"
            disabled={isLoading}
          />

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !input.trim()}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
            <button
              onClick={() => {
                setInput("")
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
            {/* Mood Card */}
            <div className={`${getMoodBgColor(result.mood)} rounded-2xl border border-border p-6 sm:p-8 shadow-sm`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className={`w-8 h-8 ${getMoodColor(result.mood)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground/70 mb-1">Your Current Mood</h3>
                  <p className={`text-2xl sm:text-3xl font-bold ${getMoodColor(result.mood)}`}>{result.mood}</p>
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground/70 mb-4">Confidence Score</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence_score * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-primary min-w-fit">
                  {Math.round(result.confidence_score * 100)}%
                </span>
              </div>
              <p className="text-xs text-foreground/60 mt-3">
                How confident we are in this analysis based on your input
              </p>
            </div>

            {/* Stress Factors */}
            {result.key_stress_factors && result.key_stress_factors.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-semibold text-foreground/70 mb-4">Key Stress Factors</h3>
                <div className="space-y-2">
                  {result.key_stress_factors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <p className="text-foreground/80">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Motivational Suggestion */}
            <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl border border-accent/20 p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground/70 mb-2">Your Wellness Suggestion</h3>
                  <p className="text-foreground leading-relaxed">{result.motivational_suggestion}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setInput("")
                  setResult(null)
                }}
                className="flex-1 px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-semibold rounded-lg transition-all duration-200"
              >
                Analyze Another Entry
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
                <MessageCircle className="w-8 h-8 text-primary/60" />
              </div>
              <p className="text-foreground/60 text-lg">Share your thoughts to get started</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
