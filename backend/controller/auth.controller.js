// const userModel = require("../models/user.model")
// const foodPartnerModel = require("../models/foodpartner.model")
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import ngoModel from "../models/ngoModel.js";
import teacherModel from "../models/teacherModel.js";
import userModel from "../models/user.model.js";
import Student from '../models/student.js';

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, grade, school, avatar, eco_points, level, badges, completed_lessons, quiz_scores } = req.body;

        const isUserAlreadyExists = await userModel.findOne({ email });
        if (isUserAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName,
            email,
            password: hashedPassword, 
            role: "student"
        });

        await Student.create({
            user_id: user._id,
            name: fullName,
            grade: grade || "",
            school: school || "",
            avatar: avatar || "",
            eco_points: eco_points || 0,
            level: level || 1,
            badges: badges || [],
            completed_lessons: completed_lessons || [],
            quiz_scores: quiz_scores || []
        })

        const token = jwt.sign(
            { id: user._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "12d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: "student"
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "12d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: "student"
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const logoutUser = (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const teacherRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const isAccountAlreadyExists = await teacherModel.findOne({ email });
        if (isAccountAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Teacher account already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await teacherModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: teacher._id, role: "teacher" },
            process.env.JWT_SECRET,
            { expiresIn: "12d" }
        );

        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            success: true,
            message: "Teacher registered successfully",
            token,
            user: {
                _id: teacher._id,
                email: teacher.email,
                name: teacher.name,
                role: "teacher"
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await teacherModel.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: teacher._id, role: "teacher" },
            process.env.JWT_SECRET,
            { expiresIn: "12d" }
        );

        res.cookie("token", token, { httpOnly: true });

        return res.status(200).json({
            success: true,
            message: "Teacher logged in successfully",
            token,
            user: {
                _id: teacher._id,
                email: teacher.email,
                name: teacher.name,
                role: "teacher"
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logoutTeacher = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Food partner logged out successfully" });
}

export const ngoRegister = async (req, res) => {

    const { ngoName, email, password } = req.body;

    const isAccountAlreadyExists = await ngoModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food partner account already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const ngo = await ngoModel.create({
        ngoName,
        email,
        password: hashedPassword,
        // phone,
        // address,
        // contactName
    })

    await ngo.save();

    const token = jwt.sign(
        { id: ngo._id, role: "ngo" },
        process.env.JWT_SECRET,
        { expiresIn: "12d" }
    );

    res.cookie("token", token)

    res.status(201).json({success: true,
        message: "Teacher registered successfully",
        token,
        user: {
            role: "ngo",
            _id: ngo._id,
            email: ngo.email,
            name: ngo.ngoName,
            // address: foodPartner.address,
            // contactName: foodPartner.contactName,
            // phone: foodPartner.phone
        }
    })

}

export const ngoLogin = async (req, res) => {

    const { email, password } = req.body;

    const ngo = await ngoModel.findOne({
        email
    })

    if (!ngo) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, ngo.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        { id: ngo._id, role: "ngo" },
        process.env.JWT_SECRET,
        { expiresIn: "12d" }
    );

    res.cookie("token", token)

    res.status(200).json({success: true,
        message: "NGO logged in successfully",
        token,
        user: {
            role: "ngo",
            _id: ngo._id,
            email: ngo.email,
            name: ngo.ngoName
        }
    })
}

export const logoutNGO = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "NGO logged out successfully"
    });
}

export const getUser = async (req, res) => {
    try {
        return res.json({
            success: true,
            message: "User fetched successfully",
            role: req.role,
            user: req.user,
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

