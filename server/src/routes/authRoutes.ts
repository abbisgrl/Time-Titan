import express from 'express';
import { createPasswordHandler, loginHandler, registerHandler, userDetails } from '../handlers/authHandler';
import { protectRoute } from '../middlewares/authMiddlewave';
const router = express.Router();

router.post('/login', loginHandler);

router.post('/register', registerHandler);

router.post('/createpassword', createPasswordHandler);

router.get('/userDetails', protectRoute, userDetails);

export default router;
