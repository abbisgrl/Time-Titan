import express from 'express';
import { isOwnerOnly, protectRoute } from '../middlewares/authMiddlewave';
import { addProject, deleteProject, getProjectsList, updateProject } from '../handlers/projectHandle';

const router = express.Router();

router.get('/list', protectRoute, getProjectsList);

router.post('/add', protectRoute, isOwnerOnly, addProject);

router.delete('/delete/:userId', protectRoute, isOwnerOnly, deleteProject);

router.put('/update/:userId', protectRoute, isOwnerOnly, updateProject);

export default router;
