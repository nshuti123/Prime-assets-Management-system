import express from 'express';
import { Assignment } from '../models/index.js'; // adjust path if needed
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getAssignments, createAssignment, updateAssignment  } from '../controllers/assignmentController.js';

const router = express.Router();

router.get('/', verifyToken, getAssignments);
router.post('/', verifyToken, createAssignment);

router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await Assignment.findAll({
      order: [['assignedAt', 'DESC']]
    });

    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

router.put('/:id', verifyToken, updateAssignment);

router.post('/:id/return', verifyToken, async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    assignment.returnedDate = new Date();
    await assignment.save();

    res.json({ message: 'Asset returned', assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to return asset' });
  }
});


export default router;
