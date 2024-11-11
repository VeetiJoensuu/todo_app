import express from 'express';
const router = express.Router();
import { postLogin, postRegistration } from '../controllers/UserController.js';

router.post('/login', postLogin); // Route for user login
router.post('/register', postRegistration); // Route for user registration

export default router;
