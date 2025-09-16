import express from 'express'
import { seedController } from '../controller/seed.controller.js';

const seedRouter = express.Router();

seedRouter.get('/seed-students', seedController)

export default seedRouter;