import express from 'express';
import { createTasks, deleteTasks, getTaskList, updateTasks } from '../handlers/taskHandler';
import { protectRoute } from '../middlewares/authMiddlewave';

const router = express.Router();

router.get('/list/:projectId', protectRoute, getTaskList);

router.post('/create', protectRoute, createTasks);

router.put('/update', protectRoute, updateTasks);

router.delete('/delete', protectRoute, deleteTasks);

export default router;
