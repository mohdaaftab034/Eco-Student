import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: String,
    difficulty: String,
    eco_points_reward: Number,
    duration_days: Number,
    verification_type: String,
    instructions: [String],

    participants: [{
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
        joined_at: { type: Date, default: Date.now },
        completed: { type: Boolean, default: false }
    }],

    ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
}, { timestamps: true });

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;
