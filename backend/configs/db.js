import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("database cannected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/eco-learn`)
    } catch (error) {
        console.log(error);
    }
}