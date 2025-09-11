import express from "express";
import { getUser, loginUser, logoutNGO, logoutTeacher, logoutUser, ngoLogin, ngoRegister, registerUser, teacherLogin, teacherRegister } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.js";

const Router = express.Router();


Router.post('/user/register', registerUser);
Router.post('/user/login', loginUser);
Router.get('/user/logout', logoutUser);

Router.get('/get/data', protect, getUser);

Router.post('/teacher/register', teacherRegister);
Router.post('/teacher/login', teacherLogin);
Router.get('/teacher/logout', logoutTeacher);

Router.post('/ngo/register', ngoRegister);
Router.post('/ngo/login', ngoLogin);
Router.get('/ngo/logout', logoutNGO);


export default Router;