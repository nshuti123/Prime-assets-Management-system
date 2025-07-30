// src/routes/assetRoutes.js
import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { createAsset } from '../controllers/assetController.js';
import { getAssets } from '../controllers/assetController.js';
import { updateAssets } from '../controllers/assetController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import {deleteAsset} from '../controllers/assetController.js';
import { assignAsset } from '../controllers/assetController.js';
import { assignAssetToUser } from '../controllers/assignmentController.js';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { Asset } from '../models/index.js';


const router = express.Router();
router.get('/', verifyToken, getAssets);
router.post('/', verifyToken, upload.single('document'), createAsset);
router.put('/:id', verifyToken, upload.single('document'), updateAssets);
router.delete('/:id', verifyToken, deleteAsset);
router.put('/:id/assign', verifyToken, assignAsset);
router.post('/assign', verifyToken, assignAssetToUser);



router.get('/my-assets', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware

    const assets = await Asset.findAll({
      where: { assignedTo: userId },
      order: [['createdAt', 'DESC']],
    });

    res.json({ assets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch assigned assets' });
  }
});
const uploadCsv = multer({ dest: 'uploads/' });

router.post('/upload-csv', uploadCsv.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      const purchaseDate = new Date(data.PurchaseDate);
      const value = parseFloat(data.Value);

      results.push({
        name: data.Name?.trim() || null,
        category: data.Category?.trim() || null,
        serialNumber: data.SerialNumber?.trim() || null,
        value: isNaN(value) ? null : value,
        condition: data.Condition?.trim() || null,
        purchaseDate: isNaN(purchaseDate.getTime()) ? null : purchaseDate,
      });
    })
    .on('end', async () => {
      const cleaned = results.filter(
        (r) =>
          r.name || r.category || r.serialNumber || r.value || r.condition
      );

      try {
        await Asset.bulkCreate(cleaned);
        fs.unlinkSync(filePath);
        res.status(200).json({ message: `${cleaned.length} assets uploaded successfully.` });
      } catch (err) {
        console.error('CSV bulkCreate error:', err);
        res.status(500).json({ message: 'Failed to import assets', error: err.message });
      }
    })
    .on('error', (err) => {
      console.error('CSV stream error:', err);
      res.status(500).json({ message: 'Failed to parse CSV file', error: err.message });
    });
});
            
export default router;
