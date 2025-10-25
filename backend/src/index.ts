import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import FitParser, { FitActivity } from 'fit-file-parser';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fitParser = new FitParser({ force: true });
  
  fitParser.parse(req.file.buffer, (error: Error | null, data: FitActivity) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
