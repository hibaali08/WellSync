"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from "recharts"
import { TrendingUp, Calendar, Award } from "lucide-react"

export default function InsightsPage() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/insights`)
        setData(res.data)
      } catch (err) {
        console.error(err)
        setError("Unable to fetch insights. Make sure your backend is running.")
      }
    }
    fetchInsights()
  }, [])
  

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        {error}
      </main>
    )
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-foreground/60">
        Loading insights...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-wellsync flex flex-col">
      <div className="flex-1 flex flex-col max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Your Wellness Insights</h1>
          <p className="text-foreground/60">{data.message}</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/70 rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <TrendingUp size={18} /> Stress Level
            </h3>
            <p className="text-3xl font-bold text-primary mb-1">{data.stress_level || "40"}%</p>
            <p className="text-sm text-foreground/60">Down from 75% - Great progress!</p>
          </div>

          <div className="bg-white/70 rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Calendar size={18} /> Sleep Quality
            </h3>
            <p className="text-3xl font-bold text-green-600 mb-1">{data.sleep_hours || "7.5"}h</p>
            <p className="text-sm text-foreground/60">Average per night this week</p>
          </div>

          <div className="bg-white/70 rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Award size={18} /> Focus Score
            </h3>
            <p className="text-3xl font-bold text-yellow-500 mb-1">{data.focus_score || "75"}%</p>
            <p className="text-sm text-foreground/60">Up from 40% - Excellent!</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white/70 rounded-2xl border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Progress Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.trend_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="before" fill="#A5B4FC" name="Before" radius={[8, 8, 0, 0]} />
              <Bar dataKey="after" fill="#4F46E5" name="After" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend (Line Chart) */}
        <div className="bg-white/70 rounded-2xl border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Weekly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.weekly_data || [
              { day: "Mon", stress: 70, mood: 55, sleep: 7 },
              { day: "Tue", stress: 65, mood: 60, sleep: 7.2 },
              { day: "Wed", stress: 60, mood: 65, sleep: 7.5 },
              { day: "Thu", stress: 50, mood: 70, sleep: 7.6 },
              { day: "Fri", stress: 45, mood: 75, sleep: 7.8 },
              { day: "Sat", stress: 40, mood: 78, sleep: 7.9 },
              { day: "Sun", stress: 45, mood: 76, sleep: 8 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stress" stroke="#22C55E" name="Stress Level" />
              <Line type="monotone" dataKey="mood" stroke="#4F46E5" name="Mood" />
              <Line type="monotone" dataKey="sleep" stroke="#10B981" name="Sleep (hours)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

  
     
      {/* Recommendations */}
      <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl border border-border p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Continue Daily Chats</h3>
                <p className="text-sm text-foreground/60">Your stress levels improve with regular conversations</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-secondary">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Maintain Sleep Schedule</h3>
                <p className="text-sm text-foreground/60">You're doing great with 7.5 hours - keep it up!</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-accent">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Take Weekly Quizzes</h3>
                <p className="text-sm text-foreground/60">Track patterns and celebrate your progress</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Practice Mindfulness</h3>
                <p className="text-sm text-foreground/60">Your focus score improved 35% - amazing work!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
