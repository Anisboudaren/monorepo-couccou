import path from 'path';
import pdfParser from '../utils/pdf-parser';
import docxParser from '../utils/docx-parser';
import { UploadedFile } from '../types/express';

const extractText = async (file: UploadedFile): Promise<string> => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === '.pdf') {
    return await pdfParser(file.path);
  } else if (ext === '.docx') {
    return await docxParser(file.path);
  } else {
    throw new Error('Unsupported file type');
  }
};

export default { extractText };
