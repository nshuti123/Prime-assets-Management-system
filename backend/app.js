const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const assetRoutes = require('./routes/assetsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes); 
app.use('/api/assets/upload-csv')
sequelize.sync().then(() => console.log('DB connected'));

app.listen(5000, () => console.log('Server running on port 5000'));
