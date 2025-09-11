import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import teacherModel from "../models/teacherModel.js";
import ngoModel from "../models/ngoModel.js";

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    } else {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, role } = decoded;

        let user = null;

        if (role === "student") {
            user = await userModel.findById(id).select("-password");
        } else if (role === "teacher") {
            user = await teacherModel.findById(id).select("-password");
        } else if (role === "ngo") {
            user = await ngoModel.findById(id).select("-password");
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        req.role = role; // 👈 role bhi request me store kar lo
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
