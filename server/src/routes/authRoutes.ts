import express from 'express';
import { loginHandler, registerHandler } from '../handlers/authHandler';
const router = express.Router();

/* GET home page. */
router.post('/login', loginHandler);

router.post('/register', registerHandler);

export default router;
