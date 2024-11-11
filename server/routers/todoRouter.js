import { Router } from 'express';
import { auth } from '../helpers/auth.js';
import { getTasks, postTask, deleteTask } from '../controllers/TaskController.js';

const router = Router();

router.get('/', getTasks); // Route to get all tasks
router.post('/create', auth, postTask); // Route to create a new task (requires authentication)
router.delete('/delete/:id', deleteTask); // Route to delete a task by id (requires authentication)

export default router;
