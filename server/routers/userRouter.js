// UserRouter.js
import express from 'express';
const router = express.Router();
import { postLogin, postRegistration } from '../controllers/UserController.js';

router.post('/login', postLogin);
router.post('/register', postRegistration);

export default router;
