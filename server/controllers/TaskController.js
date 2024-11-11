import { selectAllTasks, insertTask, deleteTaskById } from '../models/Task.js';
import { emptyOrRows } from '../helpers/utils.js';

// Controller to get all tasks
const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks();
        return res.status(200).json(emptyOrRows(result));
    } catch (error) {
        return next(error);
    }
};

// Controller to create a new task
const postTask = async (req, res, next) => {
    try {
        if (!req.body.description || req.body.description.length === 0) {
            const error = new Error('Invalid description for task');
            error.statusCode = 400;
            return next(error);
        }
        const result = await insertTask(req.body.description);
        return res.status(200).json({ id: result.rows[0].id, description: req.body.description });
    } catch (error) {
        return next(error);
    }
};

// Controller to delete a task by id
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            const error = new Error('Invalid ID for task');
            error.statusCode = 400;
            return next(error);
        }
        const result = await deleteTaskById(id);
        if (result.rowCount === 0) {
            const error = new Error('Task not found');
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json({ id: result.rows[0].id });
    } catch (error) {
        return next(error);
    }
};


export { getTasks, postTask, deleteTask };
