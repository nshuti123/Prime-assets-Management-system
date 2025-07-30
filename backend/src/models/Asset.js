import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Assignment from './Assignment.js'; // ✅ Import Assignment model

const Asset = sequelize.define('Asset', {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  serialNumber: { type: DataTypes.STRING, allowNull: true, unique: true },
  value: { type: DataTypes.STRING, allowNull: true },
  condition: { type: DataTypes.STRING, allowNull: false },
  assignedTo: { type: DataTypes.INTEGER, allowNull: true },
  purchaseDate: { type: DataTypes.DATE, allowNull: true },
  document: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'assets',
  timestamps: true
});

Asset.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignedUser' });

// ✅ Hook to auto-record assignment history
Asset.afterUpdate(async (asset, options) => {
  if (asset.changed('assignedTo') && asset.assignedTo !== null) {
    await Assignment.create({
      assetId: asset.id,
      userId: asset.assignedTo,
      assignmentDate: new Date(),
      notes: 'Auto-assigned via Asset update'
    });
  }
});

export default Asset;
