import express from 'express';
import { loginHandler } from '../handlers/authHandler';

const router = express.Router();

/* GET home page. */
router.get('/tasks', loginHandler);

export default router;
