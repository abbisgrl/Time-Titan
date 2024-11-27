import express from 'express';
import { addTeamMember, deleteUser, getTeamList, updateUser, viewUser } from '../handlers/usersHandler';
import { isAdminOrOwnerRoute, protectRoute } from '../middlewares/authMiddlewave';

const router = express.Router();

router.get('/list', protectRoute, isAdminOrOwnerRoute, getTeamList);

router.post('/add', protectRoute, isAdminOrOwnerRoute, addTeamMember);

router.delete('/delete/:userId', protectRoute, isAdminOrOwnerRoute, deleteUser);

router.put('/update/:userId', protectRoute, isAdminOrOwnerRoute, updateUser);

router.get('/view/:userId', protectRoute, isAdminOrOwnerRoute, viewUser);

export default router;
