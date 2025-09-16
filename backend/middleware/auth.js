// middleware/protect.js
import jwt from "jsonwebtoken";
import teacherModel from "../models/teacherModel.js";
import Student from "../models/student.js";
import ngoModel from "../models/ngoModel.js";
import userModel from "../models/user.model.js";


export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;

        let userRecord = null;

        // Prefer role from token — fallback to checking User collection
        if (role === "teacher") {
            userRecord = await teacherModel.findById(id).select("-password");
        } else if (role === "ngo") {
            userRecord = await ngoModel.findById(id).select("-password");
        } else if (role === "student") {
            // student info stored in studentModel, but we may want the authentication User as well
            userRecord = await Student.findOne({ user_id: id }).select("-__v -createdAt -updatedAt");
            // If you want also userModel data: const authUser = await User.findById(id).select("-password");
        }

        // If role wasn't provided or specific model didn't find, fallback to User collection
        if (!userRecord) {
            userRecord = await userModel.findById(id).select("-password");
        }

        if (!userRecord) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = userRecord;
        req.role = role || userRecord.role || "student";
        next();
    } catch (err) {
        console.error("protect middleware error:", err);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
