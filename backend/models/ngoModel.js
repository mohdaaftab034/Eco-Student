import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema({
    ngoName: {
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

const ngoModel = mongoose.model("ngoModel", ngoSchema);

export default ngoModel;