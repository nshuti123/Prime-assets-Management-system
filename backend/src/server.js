import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import sequelize from './config/database.js';
import Asset from './models/Asset.js';
import path from 'path';
import assignmentRoutes from './routes/assignmentRoutes.js';


dotenv.config();

await sequelize.sync({ alter: true });

const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Routes
app.use('/api/admin', authRoutes);
app.use('/api/users', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/uploads', (req, res, next) => {
  console.log('Uploads request:', req.path);
  next();
});
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


// Start server
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running...');
});
