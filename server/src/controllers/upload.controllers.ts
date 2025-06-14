import { Request, Response } from 'express';
import uploadService from '../services/upload.services';

const handleUpload = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file)  res.status(400).json({ error: 'No file uploaded' });
    else { 
    const text = await uploadService.extractText(file);
     res.json({ success: true, text });
    }
   
  } catch (err) {
    console.error(err);
     res.status(500).json({ error: 'Failed to process file' });
  }
};

export default { handleUpload };
