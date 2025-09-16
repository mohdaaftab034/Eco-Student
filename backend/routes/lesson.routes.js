import express from 'express'
import { createLesson, deleteLesson, getLessons, updateLesson } from '../controller/lesson.controller.js';

const lessonRouter = express.Router();

lessonRouter.post("/", createLesson);

lessonRouter.delete('/:id', deleteLesson);
lessonRouter.get('/', getLessons);
lessonRouter.put('/:id', updateLesson);

export default lessonRouter;