import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/', // Create this folder
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const upload = multer({ storage });
