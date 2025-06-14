import fs from 'fs';
import mammoth from 'mammoth';

export default async (filePath: string): Promise<string> => {
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};
