import { Router } from 'express';
import { auth } from '../helpers/auth.js';
import { getTasks, postTask, deleteTask } from '../controllers/TaskController.js';

const router = Router();

router.get('/', getTasks);
router.post('/create', auth, postTask);
router.delete('/delete/:id', deleteTask);

export default router;
