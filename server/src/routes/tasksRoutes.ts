import express from 'express';
import {
  addComment,
  createSubTask,
  createTasks,
  deleteSubTask,
  deleteTasks,
  getTaskList,
  updateSubTask,
  updateTasks,
  viewSubTask,
  viewTask,
} from '../handlers/taskHandler';
import { protectRoute } from '../middlewares/authMiddlewave';

const router = express.Router();

router.get('/list/:projectId', protectRoute, getTaskList);

router.post('/create', protectRoute, createTasks);

router.post('/update', protectRoute, updateTasks);

router.delete('/delete/:taskId', protectRoute, deleteTasks);

router.get('/view/:taskId', protectRoute, viewTask);

router.post('/subtask/create', protectRoute, createSubTask);

router.post('/subtask/update', protectRoute, updateSubTask);

router.delete('/subtask/delete/:subTaskId', protectRoute, deleteSubTask);

router.get('/subtask/view/:subTaskId', protectRoute, viewSubTask);

router.post('/add/comment', protectRoute, addComment);

export default router;
