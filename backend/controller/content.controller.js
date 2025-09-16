import Challange from "../models/challenge.js";
import Compaign from "../models/compaign.js";
import Lession from "../models/lession.js";
import Quiz from "../models/quiz.js";
import Student from "../models/student.js";



export const getLessons = async (req, res) => {
    try {
        const lessons = await Lession.find().sort({ createdAt : -1});
        res.json({ success: true, list: lessons, total: lessons.length });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json({ success: true, list: quizzes});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getChallange = async (req, res) => {
    try {
        const challenges = await Challange.find().sort({createdAt: -1});
        res.json({success: true, list: challenges});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getCompaign = async (req, res) => {
    try {
        const compaign = await Compaign.find().sort({createdAt: -1});
        res.json({success: true, list: compaign, total: compaign.length });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getLeaderBoard = async (req, res) => {
    try {
        const students = await Student.find().sort({eco_points: -1}).limit(10)
        res.json({success: true, list: students})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}