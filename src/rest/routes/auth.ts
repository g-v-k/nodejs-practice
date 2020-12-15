import * as express from 'express';
import * as authController from '../controllers/auth.js';
export const authRoutes = express.Router();

authRoutes.post('/signup',authController.postSignup);
authRoutes.post('/login',authController.login);
authRoutes.post('/logout',authController.logout);
//authRoutes.get('/username',authController.usernameCheck);