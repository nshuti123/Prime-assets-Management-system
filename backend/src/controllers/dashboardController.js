import { Asset } from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboardData = async (req, res) => {
  try {
    const totalAssets = await Asset.count();

    const assignedAssets = await Asset.count({ 
      where: { 
        assignedTo: { [Op.ne]: null } 
      }
    });

    const assetsNeedingRepair = await Asset.count({ 
      where: { condition: 'Needs-Repair' } 
    });

    const lostAssets = await Asset.count({ 
      where: { condition: 'Lost' } 
    });

    res.json({
      totalAssets,
      assignedAssets,
      assetsNeedingRepair,
      lostAssets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};
