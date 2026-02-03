import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'uploads/products',
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const upload = multer({ storage });
