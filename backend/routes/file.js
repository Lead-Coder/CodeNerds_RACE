import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name from the module URL (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set the public folder for static access (main public folder)
const uploadPath = path.join(__dirname, '../uploads'); // Upload files to the root `uploads` folder

// Ensure the uploads directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory if it doesn't exist
}

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Specify the folder where the file will be uploaded
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Retain the original filename (no random number)
  }
});

const upload = multer({ storage });

// Upload route for handling file upload and returning the file URL
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Create the URL for accessing the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  // Respond with the file URL (to be used further in your backend)
  res.json({ fileUrl });
});

router.post('/process', (req, res) => {
  
});

export default router;
