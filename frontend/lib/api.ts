import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; // Your FastAPI URL

export const sendQuizData = async (answers: Record<number, string>) => {
  try {
    // Map the user’s text answers to numeric + boolean values
    const payload = {
      sleep_hours: Number(answers[1]) || 7, // fallback if blank
      caffeine_cups: Number(answers[2]) || 2,
      smoke: answers[3]?.toLowerCase().includes("yes") || false,
      water_intake_glasses: Number(answers[4]) || 6,
      work_hours: Number(answers[5]) || 9,
    };

    const response = await axios.post("http://127.0.0.1:8000/api/quiz", payload);

    return response.data;
  } catch (error) {
    console.error("Quiz API Error:", error);
    return { wellness_score: null, recommendations: [] };
  }
};


export const sendChatMessage = async (message: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message });
    return response.data;
  } catch (error) {
    console.error("Chat API Error:", error);
    return { reply: "Sorry, something went wrong." };
  }
};
