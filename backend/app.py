from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(
    title="WellSync API",
    description="Backend for Chat Analyzer, Quiz, Scheduler, Reflection, and Insights.",
    version="1.0.0"
)

def root():
    return {"message": "🚀 WellSync backend is running successfully!"}


from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Data Models
# ---------------------------

class ChatInput(BaseModel):
    text: str

class ChatAnalysisOutput(BaseModel):
    mood: str
    confidence_score: float
    key_stress_factors: List[str]
    motivational_suggestion: str

class QuizInput(BaseModel):
    sleep_hours: int
    caffeine_cups: int
    smoke: bool
    water_intake_glasses: int
    work_hours: int

class QuizOutput(BaseModel):
    wellness_score: int
    recommendations: List[str]

class ReflectionInput(BaseModel):
    text: str
    date: Optional[str] = None

# ---------------------------
# Storage (in-memory for now)
# ---------------------------
# Store user activity across endpoints
user_logs = {
    "chat_history": [],
    "quiz_history": [],
    "schedule_history": [],
    "reflection_history": [],
    "insights": []
}


# ---------------------------
# 1️⃣ Chat Analyzer Endpoint
# ---------------------------
@app.post("/api/chat-analyzer", response_model=ChatAnalysisOutput)
def analyze_chat(input: ChatInput):
    text = input.text.lower()
    mood, confidence = "Neutral", 0.6
    factors, suggestion = [], ""

    if any(k in text for k in ["tired", "exhausted", "drained"]):
        mood, confidence = "Tired & Fatigued", 0.85
        suggestion = "Take a short break and rest your mind."
        factors.append("Insufficient rest")

    elif any(k in text for k in ["stress", "anxious", "worried", "pressure"]):
        mood, confidence = "Stressed & Anxious", 0.9
        suggestion = "Try breathing exercises or journaling to relax."
        factors.append("Work-related stress")

    elif any(k in text for k in ["happy", "positive", "great", "good"]):
        mood, confidence = "Happy & Positive", 0.88
        suggestion = "That’s wonderful! Keep up your positive mindset."
        factors.append("Positive mindset")

    elif any(k in text for k in ["calm", "peaceful", "relaxed"]):
        mood, confidence = "Calm & Peaceful", 0.82
        suggestion = "You’re in a good place. Stay mindful."

    if not factors:
        factors.append("General daily challenges")

    result = {
        "mood": mood,
        "confidence_score": confidence,
        "key_stress_factors": factors,
        "motivational_suggestion": suggestion
    }

    user_logs["chat_history"].append(result)
    return result


# ---------------------------
# 2️⃣ Wellness Quiz Endpoint
# ---------------------------
@app.post("/api/quiz", response_model=QuizOutput)
def analyze_quiz(payload: QuizInput):
    score = 0
    recs = []

    if 7 <= payload.sleep_hours <= 9:
        score += 10
    elif payload.sleep_hours < 6:
        score += 5
        recs.append("Try to get at least 7 hours of sleep.")
    else:
        score += 8

    if payload.caffeine_cups <= 2:
        score += 10
    elif payload.caffeine_cups <= 4:
        score += 6
        recs.append("Reduce caffeine to 2 cups or less.")
    else:
        score += 3
        recs.append("Too much caffeine! Cut back.")

    if payload.smoke:
        score += 3
        recs.append("Avoid smoking for better lung health.")
    else:
        score += 10

    if payload.water_intake_glasses >= 8:
        score += 10
    elif payload.water_intake_glasses >= 5:
        score += 7
        recs.append("Drink a little more water.")
    else:
        score += 4
        recs.append("Increase water intake.")

    if 8 <= payload.work_hours <= 9:
        score += 10
    elif payload.work_hours > 10:
        score += 5
        recs.append("Try not to overwork.")
    else:
        score += 8

    wellness_score = int((score / 50) * 100)

    result = {
        "wellness_score": wellness_score,
        "recommendations": recs
    }

    user_logs["quiz_history"].append(result)
    return result


# ---------------------------
# 3️⃣ Scheduler Endpoint
# ---------------------------
@app.get("/api/scheduler")
def generate_schedule():
    """Generates a personalized daily routine using latest chat and quiz data."""
    try:
        # Check if data exists
        if not user_logs["chat_history"]:
            return {"error": "Please complete the Chat Analyzer first."}
        if not user_logs["quiz_history"]:
            return {"error": "Please complete the Wellness Quiz first."}

        last_chat = user_logs["chat_history"][-1]
        last_quiz = user_logs["quiz_history"][-1]

        # Extract mood and wellness score safely
        mood = last_chat.get("mood", "Neutral")
        wellness_score = last_quiz.get("wellness_score", 70)

        # Create base schedule template
        routine = [
            "🕖 7:00 AM - Morning walk or meditation (10 mins)",
            "🥣 8:00 AM - Healthy breakfast",
            "💻 9:00 AM - Focused work session",
            "☕ 11:00 AM - Short tea/coffee break",
            "🍱 1:00 PM - Balanced lunch",
            "🧘 5:00 PM - Light exercise or stretching",
            "📓 9:00 PM - Reflection or journaling"
        ]

        # Personalize based on mood
        if "stressed" in mood.lower() or "anxious" in mood.lower():
            routine.insert(1, "🧘 7:30 AM - 10-min mindfulness breathing session")
        elif "tired" in mood.lower():
            routine.insert(2, "💤 10:30 AM - Short 15-min power nap recommended")
        elif "happy" in mood.lower():
            routine.append("🎶 8:00 PM - Enjoy music or a hobby session")

        # Personalize based on score
        if wellness_score < 60:
            routine.append("🛌 Sleep early tonight for better recovery")
        elif wellness_score > 85:
            routine.append("✨ Great job! Maintain your current lifestyle habits")

        response = {
            "message": "Your personalized daily schedule is ready.",
            "mood_focus": mood,
            "wellness_score": wellness_score,
            "routine": routine
        }

        user_logs["schedule_history"].append(response)
        return response

    except Exception as e:
        print("Scheduler error:", e)
        return {"error": f"Internal error: {str(e)}"}

# ---------------------------
# 4️⃣ Reflection Endpoint
# ---------------------------
class ReflectionInput(BaseModel):
    morning_mood: str
    evening_text: str

class ReflectionOutput(BaseModel):
    morning_mood: str
    evening_mood: str
    mood_change: int
    mood_trend: str
    insights: list
    suggestion: str

@app.post("/api/reflection", response_model=ReflectionOutput)
def reflection_analysis(payload: ReflectionInput):
    try:
        # Simple keyword-based mood detection
        text = payload.evening_text.lower()

        happy = ["happy", "great", "good", "positive", "excited"]
        tired = ["tired", "exhausted", "sleepy"]
        stress = ["stress", "worried", "anxious", "tense"]
        calm = ["calm", "peaceful", "relaxed"]

        evening_mood = "Neutral"
        score = 50
        if any(w in text for w in happy):
            evening_mood = "Happy & Positive"
            score = 85
        elif any(w in text for w in tired):
            evening_mood = "Tired & Fatigued"
            score = 40
        elif any(w in text for w in stress):
            evening_mood = "Stressed & Anxious"
            score = 35
        elif any(w in text for w in calm):
            evening_mood = "Calm & Peaceful"
            score = 75

        # Score mapping for morning mood
        morning_scores = {
            "Happy & Positive": 85,
            "Calm & Peaceful": 75,
            "Neutral": 50,
            "Tired & Fatigued": 40,
            "Stressed & Anxious": 35,
        }

        morning_score = morning_scores.get(payload.morning_mood, 50)
        mood_change = score - morning_score
        mood_trend = (
            "improved" if mood_change > 10 else
            "declined" if mood_change < -10 else
            "stable"
        )

        # Basic insights
        insights = []
        if "accomplished" in text or "completed" in text:
            insights.append("You had a productive day!")
        if "challenge" in text or "difficult" in text:
            insights.append("You handled challenges well.")
        if "learn" in text or "growth" in text:
            insights.append("You learned something new.")
        if not insights:
            insights.append("Each day brings lessons — reflect and grow.")

        suggestion = (
            "Your mood improved — great job!" if mood_trend == "improved"
            else "Your mood dipped — rest and reset tomorrow." if mood_trend == "declined"
            else "Steady mood — keep your balanced routine."
        )

        result = {
            "morning_mood": payload.morning_mood,
            "evening_mood": evening_mood,
            "mood_change": mood_change,
            "mood_trend": mood_trend,
            "insights": insights,
            "suggestion": suggestion
        }

        user_logs["reflection_history"].append(result)
        return result

    except Exception as e:
        return {"error": f"Internal error: {str(e)}"}

# ---------------------------
# 5️⃣ Insights Endpoint
# ---------------------------

# ---------------------------
# Insights Output Model
# ---------------------------
class InsightsOutput(BaseModel):
    wellness_score: int
    mood_trend: str
    message: str
    recommendations: list
    trend_data: list

    
@app.get("/api/insights", response_model=InsightsOutput)
def get_insights():
    if not user_logs["chat_history"] or not user_logs["quiz_history"] or not user_logs["reflection_history"]:
        return {"error": "Need chat, quiz, and reflection data first."}
    
    last_chat = user_logs["chat_history"][-1]
    last_quiz = user_logs["quiz_history"][-1]
    last_reflection = user_logs["reflection_history"][-1]

    improvement = last_reflection["mood_trend"]
    avg_score = last_quiz["wellness_score"]

    return {
        "wellness_score": avg_score,
        "mood_trend": improvement,
        "message": f"Your wellness score is {avg_score} and mood has {improvement}.",
        "recommendations": last_reflection["insights"],
        "trend_data": [
            {"metric": "Sleep", "before": 5, "after": 7},
            {"metric": "Focus", "before": 40, "after": 75},
            {"metric": "Mood", "before": 50, "after": avg_score // 2}
        ]
    }
