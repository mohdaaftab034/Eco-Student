import express from 'express'
import { getChallange, getCompaign, getLessons, getQuizzes } from '../controller/content.controller.js';

const contentRouter = express.Router();

contentRouter.get('/lessons', getLessons);
contentRouter.get('/quizzes', getQuizzes);
contentRouter.get('/challenges', getChallange);
contentRouter.get('/campaigns', getCompaign);

export default contentRouter;