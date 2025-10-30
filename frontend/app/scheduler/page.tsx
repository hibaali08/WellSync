"use client"

import { useState, useEffect } from "react"
import { Clock, Coffee, Zap, Moon, CheckCircle2 } from "lucide-react"
import axios from "axios"

interface ScheduleItem {
  id: number
  time: string
  activity: string
  duration: string
  icon: JSX.Element
  color: string
}

export default function SchedulerPage() {
  const [schedule, setSchedule] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedItems, setCompletedItems] = useState<number[]>([])

  // Fetch schedule from backend
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/scheduler")
        if (response.data.error) {
          setError(response.data.error)
        } else {
          setSchedule(response.data.routine)
        }
      } catch (err) {
        console.error("Error fetching schedule:", err)
        setError("Unable to fetch schedule. Please ensure the backend is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  const toggleComplete = (id: number) => {
    setCompletedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const completionPercentage = Math.round(
    (completedItems.length / schedule.length) * 100
  )

  return (
    <main className="min-h-screen bg-gradient-wellsync flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Daily Schedule
          </h1>
          <p className="text-foreground/60">
            Your personalized wellness-focused daily plan
          </p>
        </div>

        {loading ? (
          <p className="text-center text-foreground/60">Loading your schedule...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Today's Progress</h3>
                <span className="text-2xl font-bold text-primary">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-sm text-foreground/60 mt-3">
                {completedItems.length} of {schedule.length} activities completed
              </p>
            </div>

            <div className="space-y-4">
              {schedule.map((activity, index) => (
                <div
                  key={index}
                  className={`border bg-white/70 border-border rounded-2xl p-5 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    completedItems.includes(index) ? "opacity-60" : ""
                  }`}
                  onClick={() => toggleComplete(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {completedItems.includes(index) ? (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          completedItems.includes(index)
                            ? "line-through text-foreground/50"
                            : "text-foreground"
                        }`}
                      >
                        {activity}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
