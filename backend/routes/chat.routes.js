import express, { Router } from 'express';
import { askAI } from '../controller/chat.controller.js';

const chatRouter = express.Router();


chatRouter.post('/ai', askAI);

export default chatRouter;