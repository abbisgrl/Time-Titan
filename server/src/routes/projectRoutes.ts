import express from 'express';
import { isOwnerOnly, protectRoute } from '../middlewares/authMiddlewave';
import { addProject, deleteProject, getProjectsList, updateProject, viewProject } from '../handlers/projectHandle';

const router = express.Router();

router.get('/list', protectRoute, getProjectsList);

router.post('/add', protectRoute, isOwnerOnly, addProject);

router.delete('/delete/:projectId', protectRoute, isOwnerOnly, deleteProject);

router.put('/update/:projectId', protectRoute, isOwnerOnly, updateProject);

router.get('/view/:projectId', protectRoute, isOwnerOnly, viewProject);

export default router;
