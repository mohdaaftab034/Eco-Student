import Quiz from "../models/quiz.js";




export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getSingleQuizzes = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if(!quiz) {
            return res.json({success: false, message: "Quiz not found"})
        }
        res.json(quiz);
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        console.log(req.body);
        const saved = await newQuiz.save();
        res.json({success: true, saved});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const deleteQuiz = async (req, res) => {
    try {
        const removed = await Quiz.findByIdAndDelete(req.param.id);
        if(!removed) {
            return res.json({success: false, message: "Quiz not found"})
        }

        res.json({success: true, message: "Quiz deleted successfully"})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}