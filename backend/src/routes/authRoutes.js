import express from 'express';
import { login, register, getEmployees, getAllUsers, updateUser } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getDashboardData } from '../controllers/dashboardController.js';
import { authorizeRole } from '../middlewares/authorizeRole.js';
import { User } from '../models/index.js';  // or wherever your User model is


const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/dashboard', verifyToken, getDashboardData);
router.get('/employees', verifyToken, getEmployees);
router.get('/', verifyToken, getAllUsers);
router.put('/:id', verifyToken, updateUser);

router.get('/admin-only-route', verifyToken, authorizeRole('Admin'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

router.get('/employee-route', verifyToken, authorizeRole('Employee', 'Admin'), (req, res) => {
  res.json({ message: 'Welcome Employee or Admin!' });
});

// In authRoutes.js or userRoutes.js
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
