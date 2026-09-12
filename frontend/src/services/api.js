const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchExamConfig() {
  try {
    const res = await fetch(`${API_BASE}/config/`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn("Backend config fetch failed, using fallback:", err);
    return {
      title: "Online Assessment - TTS Set D",
      total_questions: 40,
      duration_minutes: 40,
      negative_marking: false,
      camera_required: true,
      terms_and_conditions: [
        "The candidate must answer 40 questions within the allotted time.",
        "The total examination duration is strictly 40 minutes.",
        "There is no negative marking for incorrect answers.",
        "The candidate’s laptop camera must remain active and permitted throughout the entire examination.",
        "Switching tabs or minimizing the browser window may lead to automatic disqualification.",
        "Ensure a stable internet connection and quiet environment before starting.",
        "Answers are automatically submitted when the 40-minute timer expires."
      ]
    };
  }
}

export async function validateCandidate(candidate) {
  try {
    const res = await fetch(`${API_BASE}/candidate/validate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidate)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errors?.name?.[0] || data.errors?.email?.[0] || "Validation failed");
    }
    return data;
  } catch (err) {
    // Client-side fallback validation if backend is unreachable
    if (!candidate.name || candidate.name.trim().length < 2) {
      throw new Error("Please enter a valid candidate name (at least 2 characters).");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!candidate.email || !emailRegex.test(candidate.email)) {
      throw new Error("Please enter a valid email address.");
    }
    return { status: "success", candidate };
  }
}

export async function fetchQuestions() {
  try {
    const res = await fetch(`${API_BASE}/questions/`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.questions;
  } catch (err) {
    console.error("Failed to load questions from backend:", err);
    throw err;
  }
}

export async function submitExam(payload) {
  try {
    const res = await fetch(`${API_BASE}/submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to submit exam");
    }
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error("Submission failed on backend:", err);
    throw err;
  }
}
