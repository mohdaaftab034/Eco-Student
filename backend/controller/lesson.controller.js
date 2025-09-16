import Lesson from "../models/lession.js"


export const createLesson = async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        const saved = await lesson.save();
        res.json({success: true, lesson: saved});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getLessons = async (req, res)=> {
    try {
        const lessons = await Lesson.find().sort({createdAt: -1});
        res.json({success: true, lessons});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


export const updateLesson = async (req, res) => {
    try {
        const {id} = req.params;
        const updated = await Lesson.findByIdAndUpdate(id, req.body, {new: true});
        res.json({success: true, lesson: updated})
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        await Lesson.findOneAndDelete(id);
        res.json({success: true, message: "Lesson deleted successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}