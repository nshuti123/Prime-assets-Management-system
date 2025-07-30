import sequelize from '../config/database.js';
import User from './User.js';
import Asset from './Asset.js';
import { Assignment } from './Assignment.js';

// Associations
User.hasMany(Assignment, { foreignKey: 'userId' });
Assignment.belongsTo(User, { foreignKey: 'userId' });

Asset.hasMany(Assignment, { foreignKey: 'assetId' });
Assignment.belongsTo(Asset, { foreignKey: 'assetId' });

// Export all models
export { sequelize, User, Asset, Assignment };
