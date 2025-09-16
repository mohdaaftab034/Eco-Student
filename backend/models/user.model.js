import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    role: { type: String, enum: ["student", "teacher", "ngo"], default: "student" }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("userModel", userSchema);

export default userModel;