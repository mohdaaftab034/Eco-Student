import express from 'express';
import { createChallenge, getChallenges, joinChallenge } from '../controller/challenge.controller.js';
import { protect } from '../middleware/auth.js';


const challengeRouter = express.Router();

challengeRouter.get("/", getChallenges);
challengeRouter.post("/", createChallenge);
challengeRouter.post('/:id/join',protect, joinChallenge);

export default challengeRouter;
