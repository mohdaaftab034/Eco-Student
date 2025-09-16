import express from 'express';
import { createQuiz, deleteQuiz, getAllQuizzes, getSingleQuizzes } from '../controller/quiz.controller.js';

const quizRouter = express.Router();

quizRouter.get('/', getAllQuizzes);
quizRouter.get('/:id', getSingleQuizzes);
quizRouter.post('/', createQuiz);
quizRouter.delete('/:id', deleteQuiz);

export default quizRouter;
