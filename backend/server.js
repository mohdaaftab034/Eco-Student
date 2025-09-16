import 'dotenv/config'
import express from 'express'
import Router from './routes/auth.routes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from './configs/db.js';
import router from './routes/student.routes.js';
import contentRouter from './routes/content.routes.js';
import lessonRouter from './routes/lesson.routes.js';
import quizRouter from './routes/quiz.routes.js';
import teacherRouter from './routes/teacher.routes.js';
import seedRouter from './routes/seed.routes.js';
import challengeRouter from './routes/challenge.routes.js';
import compaignRouter from './routes/compaign.routes.js';
import chatRouter from './routes/chat.routes.js';

const app = express();
connectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
    
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', Router);
app.use('/api/students', router);
app.use('/api/content', contentRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api', seedRouter);
app.use('/api/challenges', challengeRouter);
app.use('/api/campaigns', compaignRouter);
app.use('/api/chat', chatRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
}) 

