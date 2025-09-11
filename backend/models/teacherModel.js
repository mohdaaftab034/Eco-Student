import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactName: {
        type: String,
        // required: true
    },
    phone: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const teacherModel = mongoose.model("teacherModel", teacherSchema);

export default teacherModel;