import express from 'express'
import { protect } from '../middleware/auth.js';
import { addQuizScore, completeLesson, createStudent, fetchStudent, getLeaderBoard, getStudentByuserId, updateStudent, updateStudentBadges, updateStudentPoints } from '../controller/student.controller.js';

const router = express.Router();

router.get("/:userId", protect, getStudentByuserId);

router.put('/:id', protect, updateStudentPoints);

router.put('/:id/badges', protect, updateStudentBadges);


router.get('/', fetchStudent);

router.post('/', createStudent);
router.get('/leaderboard', getLeaderBoard);
router.put('/:id',protect, updateStudent);
router.put('/:id/lessons', completeLesson);
router.put('/:id/quiz', protect, addQuizScore);


export default router;