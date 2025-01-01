import express from 'express';
import { protectRoute } from '../middlewares/authMiddlewave';
import { getDashboardCardDetails, getRecentUpdatedTasks } from '../handlers/dashboardHandler';
const router = express.Router();

router.get('/cardsDetails/:projectId', protectRoute, getDashboardCardDetails);
router.get('/taskList/:projectId', protectRoute, getRecentUpdatedTasks);

export default router;
