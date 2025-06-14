import fs from 'fs';
import pdf from 'pdf-parse';

export default async (filePath: string): Promise<string> => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
};
