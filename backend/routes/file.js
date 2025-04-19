import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// 🟡 Point to the MAIN project's public/uploads folder (outside backend folder)
const uploadPath = path.join(__dirname, '../../public/uploads');

// Make sure the folder exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup (no random suffix, just original filename)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const customName = 'resume.pdf';
    cb(null, customName);
  }
});

const upload = multer({ storage });

// Route to upload file and return its public URL
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // 🟢 This assumes your main public folder is served statically
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ fileUrl });
});

export default router;
