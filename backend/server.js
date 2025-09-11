import 'dotenv/config'
import express from 'express'
import Router from './routes/auth.routes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from './configs/db.js';

const app = express();
connectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', Router)



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
}) 

