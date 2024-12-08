import express from 'express';
import { createSubTask, createTasks, deleteTasks, getTaskList, updateTasks, viewTask } from '../handlers/taskHandler';
import { protectRoute } from '../middlewares/authMiddlewave';

const router = express.Router();

router.get('/list/:projectId', protectRoute, getTaskList);

router.post('/create', protectRoute, createTasks);

router.put('/update', protectRoute, updateTasks);

router.delete('/delete', protectRoute, deleteTasks);

router.post('/subtask/create', protectRoute, createSubTask);

router.get('/view/:taskId', protectRoute, viewTask);

export default router;
