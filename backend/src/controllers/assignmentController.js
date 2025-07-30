// src/controllers/assignmentController.js

import { Assignment, Asset, User } from '../models/index.js';

export const assignAssetToUser = async (req, res) => {
  try {
    const { assetId, userId, notes } = req.body;

    // Find the asset
    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    // Assign asset to user
    asset.assignedTo = userId;
    await asset.save();

    // ✅ Create assignment history
    await Assignment.create({
      assetId: asset.id,
      userId: userId,
      assignmentDate: new Date(),
      notes: notes || 'Assigned by admin'
    });

    res.json({ message: 'Asset assigned and recorded in history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to assign asset' });
  }
};
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
  include: [
    { model: Asset, attributes: ['name', 'category', 'serialNumber'] },
    { model: User, attributes: ['name', 'email'] }
  ],
  order: [['assignmentDate', 'DESC']]
});


    res.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { assetId, userId, assignmentDate, returnedDate, notes } = req.body;

    const newAssignment = await Assignment.create({
        assetId: asset.id,
        userId: userId,
        assignmentDate: new Date(),
        notes: 'Assigned by admin'
    });
    res.status(201).json({ assignment: newAssignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { returnedDate } = req.body;

    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.returnedDate = returnedDate;
    await assignment.save();

    res.json({ message: 'Assignment updated successfully', assignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
};
