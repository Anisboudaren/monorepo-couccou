import express from 'express';
import uploadController from '../controllers/upload.controllers';
import multer from '../utils/multer';

const router = express.Router();

router.post('/file', multer.single('file'), uploadController.handleUpload);

export default router;
