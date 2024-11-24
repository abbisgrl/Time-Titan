import express from 'express';
import { loginHandler } from '../handlers/authHandler';

const router = express.Router();

router.get('/tasks', loginHandler);

export default router;
