import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Absolute path to the uploads directory
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir); // ✅ Use absolute path
  },
  filename: (_req, file, cb) => {
    const safeFilename = `${Date.now()}-${file.originalname.replace(/[^a-z0-9.\-_\s]/gi, '')}`;
    cb(null, safeFilename); // ✅ Sanitize filename
  }
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.pdf' || ext === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and DOCX files are allowed'));
  }
};

export default multer({ storage, fileFilter });

