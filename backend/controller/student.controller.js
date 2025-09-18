import mongoose from "mongoose";
import Lesson from "../models/lession.js";
import Student from "../models/student.js";



export const getStudentByuserId = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const student = await Student.findOne({ user_id: new mongoose.Types.ObjectId(userId) }).populate("user_id");

        if (!student) {
            return res.json({ success: false, message: "Student not found" })
        }

        res.json({ success: true, student });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateStudentPoints = async (req, res) => {
    try {
        const { eco_points, level } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { eco_points, level },
            { new: true }
        )


        res.json({ success: true, student });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateStudentBadges = async (req, res) => {
    try {
        const { badges } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { badges },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const fetchStudent = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 })
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch students" });
    }
}

// Create Student
export const createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();

        res.json({ success: true, student });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const getLeaderBoard = async (req, res) => {
    try {
        const leaderboard = await Student.find()
            .sort({ eco_points: -1 })
            .limit(10);
        res.json({ success: true, leaderboard });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const updateStudent = async (req, res) => {
    try {
        const { user_id } = req.params;
        const data = req.body;

        const student = await Student.findOneAndUpdate(
            { user_id }, // user_id se search karenge
            { ...data, updated_at: new Date() },
            { new: true } // updated document return karega
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            item: student
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const completeLesson = async (req, res) => {
    try {
        const { id } = req.params
        const { completed_lessons, eco_points_reward } = req.body

        let student = await Student.findById(id)

        if (!student) return res.status(404).json({ message: "Student not found" })

        // Update completed lessons
        student.completed_lessons = completed_lessons

        // Update eco points
        student.eco_points += eco_points_reward

        await student.save()

        res.json(student)
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};



export const addQuizScore = async (req, res) => {
    try {
        const { quiz_id, score } = req.body;

        const student = await Student.findById(req.params.id);


        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        student.quiz_scores.push({ quiz_id, score });

        await student.save();

        res.json({ success: true, student });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
