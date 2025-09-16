import teacherModel from "../models/teacherModel.js"


export const getTeacherProfile = async (req, res) => {
    try {
        const teacher = await teacherModel.findById(req.params.id).select("-password");
        if(!teacher) {
            return res.json({success: false, message: "Teacher not found"});
        }
        res.json({success: true, teacher});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


export const updateTeacherProfile = async (req, res) => {
    try {
        const {name, phone, address} = req.body;
        const teacher = await teacherModel.findById(req.params.id);

        if(!teacher) {
            return res.json({success: false, message: "Teacher not found"});
        }

        teacher.name = name || teacher.name;
        teacher.phone = phone || teacher.phone;
        teacher.address = address || teacher.address;

        await teacher.save();
        res.json({success: true, teacher});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}