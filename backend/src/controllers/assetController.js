import { Asset, User } from '../models/index.js';
import fs from 'fs';
import path from 'path';

export const createAsset = async (req, res) => {
  try {
    const { name, category, serialNumber, value, condition, purchaseDate, assignedTo } = req.body;
    const document = req.file ? req.file.filename : null; 

    const newAsset = await Asset.create({
      name,
      category,
      serialNumber,
      value,
      condition,
      assignedTo, // Can be null if unassigned      
      purchaseDate,
      document,

    });

    res.status(201).json({ message: 'Asset created successfully', asset: newAsset });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [{
        model: User,
        as: 'assignedUser',
        attributes: ['id', 'name'],
      }],
      order: [['id', 'ASC']]
    });
    res.json({ assets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch assets' });
  }
};


export const updateAssets = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, serialNumber, value, condition, purchaseDate } = req.body;

    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: 'Asset Not Found!' });

    // Prepare update object
    const updateData = { name, category, serialNumber, value, condition, purchaseDate };

    // If new document uploaded, update the document field
    if (req.file) {
      updateData.document = req.file.filename;
    }

    await asset.update(updateData);

    res.status(200).json(asset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error Updating Asset!' });
  }
};

export const deleteAsset = async (req, res) => {

  try {
    const { id } = req.params;

    const asset = await Asset.findByPk(id);
    if(!asset){
      return res.status(404).json({message:'Asset Not Found!!'});
    }

    if (asset.document) {
      const filePath = path.join(process.cwd(), 'uploads', asset.document);
      fs.unlink(filePath, (err) => {
        if (err){
          console.err('Failed to delete file:', err.message);

        }
      });
    }

    await asset.destroy();

    res.status(200).json({message: 'Asset deleted Successfully'});
  } catch (error) {
    console.error(err);
    res.status(500).json({message: 'Error deleting asset!!'});

    
  }

};

export const getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: 'Employee' },
      attributes: ['id', 'name', 'email'],
    });
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

export const assignAsset = async (req, res) => {
  const { id } = req.params;
  const assignedTo = parseInt(req.body.assignedTo, 10);  // Convert to int

  if (isNaN(assignedTo)) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    const employee = await User.findByPk(assignedTo);
    if (!employee || employee.role !== 'Employee') {
      return res.status(400).json({ message: 'Invalid employee' });
    }

    await asset.update({ assignedTo });
    const updatedAsset = await Asset.findByPk(id, {
  include: [{ model: User, as: 'assignedUser', attributes: ['id', 'name'] }]
});

    res.status(200).json(asset);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to assign asset' });
  }
};

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user; // 🔥 THIS IS IMPORTANT

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};
