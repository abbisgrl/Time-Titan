import express from 'express';
import { addComment, createSubTask, createTasks, deleteTasks, getTaskList, updateTasks, viewTask } from '../handlers/taskHandler';
import { protectRoute } from '../middlewares/authMiddlewave';

const router = express.Router();

router.get('/list/:projectId', protectRoute, getTaskList);

router.post('/create', protectRoute, createTasks);

router.post('/update', protectRoute, updateTasks);

router.delete('/delete/:taskId', protectRoute, deleteTasks);

router.get('/view/:taskId', protectRoute, viewTask);

router.post('/subtask/create', protectRoute, createSubTask);

router.post('/add/comment', protectRoute, addComment);

export default router;
