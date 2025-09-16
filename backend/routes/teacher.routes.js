import express from 'express'
import { getTeacherProfile, updateTeacherProfile } from '../controller/teacher.conroller.js';

const teacherRouter = express.Router();

teacherRouter.get('/:id', getTeacherProfile);



teacherRouter.put('/:id', updateTeacherProfile);

export default teacherRouter;