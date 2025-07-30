import {getDashboardData} from '../controllers/dashboardController.js';

router.get('/admin', verifyToken, getDashboardData);
