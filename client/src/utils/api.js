export const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export async function getLessons() {
    const res = await fetch(`${API_BASE}/api/lessons`);
    if (!res.ok) throw new Error('Failed to fetch lessons');
    return res.json();
}

export async function getQuizzes() {
    const res = await fetch(`${API_BASE}/api/quizzes`);
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
}

export async function createQuiz(quiz) {
    const res = await fetch(`${API_BASE}/api/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
    });
    if (!res.ok) throw new Error("Failed to create quiz");
    return res.json();
}

export async function deleteQuiz(id) {
    const res = await fetch(`${API_BASE}/api/quizzes/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete quiz");
    return res.json();
}



