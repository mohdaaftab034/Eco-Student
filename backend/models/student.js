// models/student.model.js
import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
    badge_id: String,
    name: String,
    icon: String,
    earned_at: { type: Date, default: Date.now }
});

const quizScoreSchema = new mongoose.Schema({
    quiz_id: String,
    score: Number,
    completed_at: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true, unique: true },
    name: { type: String },           // optional, can duplicate user fullName
    grade: { type: String },
    school: { type: String },
    bio: { type: String },
    favorite_subject: { type: String },
    avatar: { type: String, default: "" },
    environmental_goal: { type: String },
    eco_points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [badgeSchema],
    completed_lessons: [String],
    quiz_scores: [quizScoreSchema],
    join_date: Date,
    created_at: Date,
    updated_at: Date
}, { timestamps: true });

const Student = mongoose.model("studentModel", studentSchema);
export default Student;
