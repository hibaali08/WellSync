"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { sendQuizData } from "@/lib/api";  // Add this at the top
import axios from "axios"

interface QuizQuestion {
  id: number
  question: string
  placeholder: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How many hours do you sleep on average?",
    placeholder: "e.g., 7",
  },
  {
    id: 2,
    question: "How many cups of caffeine do you drink daily?",
    placeholder: "e.g., 2",
  },
  {
    id: 3,
    question: "Do you smoke?",
    placeholder: "e.g., Yes or No",
  },
  {
    id: 4,
    question: "How many glasses of water do you drink daily?",
    placeholder: "e.g., 6",
  },
  {
    id: 5,
    question: "How many hours do you work per day?",
    placeholder: "e.g., 9",
  },
];

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async () => {
    const allAnswered = quizQuestions.every((q) => answers[q.id]?.trim())
    if (!allAnswered) {
      alert("Please answer all questions before submitting.")
      return
    }
  
    setIsLoading(true)
    try {
      // Example input mapping for now
      const res = await axios.post("http://127.0.0.1:8000/api/quiz", {
        sleep_hours: 7,
        caffeine_cups: 2,
        smoke: false,
        water_intake_glasses: 6,
        work_hours: 9,
      })
      console.log(res.data)
      setSubmitted(true)
    } catch (err) {
      alert("Error submitting quiz. Check backend connection.")
    } finally {
      setIsLoading(false)
    }
  }
  

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-wellsync flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Quiz Submitted!</h1>
            <p className="text-lg text-foreground/70 mb-8">
              Thank you for sharing your wellness insights. Your responses help us understand your emotional patterns
              and provide better support.
            </p>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-8 mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Your Responses</h2>
              <div className="space-y-6 text-left">
                {quizQuestions.map((q) => (
                  <div key={q.id}>
                    <p className="font-semibold text-foreground mb-2">{q.question}</p>
                    <p className="text-foreground/70 italic">{answers[q.id]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleReset}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all"
              >
                Take Quiz Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/insights")}
                variant="outline"
                className="border-2 border-secondary text-secondary hover:bg-secondary/10 font-semibold px-8 py-3 rounded-lg transition-all bg-transparent"
              >
                View Insights
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-wellsync flex flex-col">
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Wellness Quiz</h1>
          <p className="text-foreground/60">Help us understand your emotional patterns</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-foreground/60">
              {Object.keys(answers).length} of {quizQuestions.length}
            </span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-8 mb-12">
          {quizQuestions.map((question, index) => (
            <div key={question.id} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <label className="block text-lg font-semibold text-foreground mb-4">{question.question}</label>
                  <textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all"
          >
            {isLoading ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </div>
    </main>
  )
}
