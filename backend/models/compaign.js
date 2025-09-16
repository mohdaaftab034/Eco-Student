import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: Number,
  eco_points: Number
});

const compaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  start_date: Date,
  end_date: Date,
  location: String,
  target_participants: Number,
  current_participants: { type: Number, default: 0 },
  impact_goal: String,
  activities: [activitySchema],
  participating_schools: [String],
  ngo_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
  status: { type: String, enum: ["planning", "active", "completed", "cancelled"], default: "planning" },
}, {timestamps: true});

const Compaign = mongoose.model('Compaign', compaignSchema);

export default Compaign;