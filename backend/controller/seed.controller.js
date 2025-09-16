import Student from "../models/student.js";


export const seedController = async (req, res) => {
    try {
        const sampleStudents = [
            {
                name: "Alice Johnson",
                grade: "5",
                school: "Green Valley Elementary",
                eco_points: 320,
                level: 3,
                completed_lessons: ["lesson1", "lesson2"],
                quiz_scores: [{ quiz_id: "quiz1", score: 80, completed_at: new Date() }],
                badges_earned: ["Eco Explorer"]
            },
            {
                name: "Bob Smith",
                grade: "6",
                school: "Sunnydale School",
                eco_points: 150,
                level: 2,
                completed_lessons: ["lesson1"],
                quiz_scores: [],
                badges_earned: []
            },
        ];

        await Student.deleteMany({});
        const created = await Student.insertMany(sampleStudents);
        res.json({success: true, message: "Insert successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}