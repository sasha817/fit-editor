import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import FitParser, { FitActivity } from 'fit-file-parser';
import exportFitRouter from './routes/exportFit';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const { format_time } = require('./helpers/time-formatter.js');

app.use(cors());
app.use(express.json());
app.use('/api', exportFitRouter);

// --- VALIDATION + VIEWING ENDPOINT ---
app.post('/api/validate', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fitParser = new FitParser({ force: true, speedUnit: 'm/s' });

  try {
    fitParser.parse(req.file.buffer, (error: Error | null,  data: FitActivity) => {
      if (error) {
        return res.status(422).json({
          error: 'Corrupted or incompatible FIT file.',
          details: error.message,
        });
      }

      try {
        const laps = data.laps || [];
        const pool_length = data.sessions?.[0].pool_length || 25; //ToDo: remove default 25!!
        const pool_length_unit = data.sessions?.[0].pool_length_unit || undefined;

        if (!laps.length) {
          return res.status(400).json({ error: 'No lap data found in file' });
        }

        const tableData = laps.map((lap: any, index: number) => {
          const lap_type = lap.num_active_lengths > 0 ? "swim" : "pause";
          const totalTime = lap.total_timer_time ?? 0;
          const totalDistance = lap.total_distance ?? 0;
          const totalStrokes = lap.total_strokes ?? 0;
          const pace_per_100m = totalDistance > 0 ? lap.total_timer_time / lap.total_distance * 100 : "";
          const pace = pace_per_100m ? Math.floor(pace_per_100m / 60) + ":" + (Math.round(pace_per_100m % 60) < 10 ? "0" + Math.round(pace_per_100m % 60) : Math.round(pace_per_100m % 60)) : ""; //ToDo: rewrite logic for <10 seconds!
          const swolf = totalTime + totalStrokes;

          return {
            interval: index + 1,
            type: lap_type,
            time: totalTime.toFixed(1),
            time_str: Math.floor(totalTime / 60) + ":" + (Math.round(totalTime % 60) < 10 ? "0" + Math.round(totalTime % 60) : Math.round(totalTime % 60)),
            length: lap.total_distance,
            pace: pace,
            strokes: totalStrokes,
            swolf: Math.round(swolf),
            swim_stroke: lap.swim_stroke,
            debug_info: lap,
          };
        });

        res.json({ valid: true, intervals: tableData });
      } catch (innerErr: any) {
        res.status(500).json({
          error: 'Error reading activity data.',
          details: innerErr.message,
        });
      }
    });

  } catch (err: any) {
    res.status(500).json({
      error: 'Unexpected parsing failure',
      details: err.message,
    });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
