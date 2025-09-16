import mongoose from 'mongoose'

const lessionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    content: { type: String, required: true },
    category: {
        type: String,
        enum: ["climate_change", "wildlife", "recycling", "energy", "water", "pollution"],
        default: 'climate_change'
    },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    eco_points_reward: { type: Number, default: 0 },
    estimated_duration: { type: Number, default: 0 }, // in minutes
    media_url: { type: String, default: "" },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "teacherModel", required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

const Lesson = mongoose.model("Lesson", lessionSchema);

export default Lesson;
