import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: Number, required: true },
    explanation: { type: String, default: "" },
    points: { type: Number, default: 0 }
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    questions: [questionSchema],
    time_limit: { type: Number, default: 0 }, // in minutes
    passing_score: { type: Number, default: 0 },
    eco_points_reward: { type: Number, default: 0 },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
