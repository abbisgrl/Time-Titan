import express from 'express';
import { loginHandler, registerHandler, userDetails } from '../handlers/authHandler';
import { protectRoute } from '../middlewares/authMiddlewave';
const router = express.Router();

router.post('/login', loginHandler);

router.post('/register', registerHandler);

router.get('/userDetails', protectRoute, userDetails);

export default router;
