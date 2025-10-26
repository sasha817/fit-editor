import express, { Request, Response } from 'express';
import fs from 'fs';
import { Decoder, Stream, Encoder, Messages } from '@garmin/fitsdk';

const router = express.Router();

router.post('/export-fit', async (req: Request, res: Response) => {
  try {
    // 1️⃣ Read existing FIT file (best from disk or upload buffer)
    const buffer = fs.readFileSync('uploads/original.fit');
    const stream = Stream.fromBuffer(buffer);

    const decoder = new Decoder(stream);
    if (!decoder.isFIT() || !decoder.checkIntegrity()) {
      return res.status(400).json({ error: 'Invalid FIT file' });
    }

    const { messages } = decoder.read(); // includes all messages: file_id, session, lap, length, etc.

    // 2️⃣ Modify laps/lengths — here you’d inject the edits from frontend
    const editedData = req.body.intervals; // Assume frontend sends an array of modified interval objects

    if (messages.lap && editedData) {
      messages.lap = messages.lap.map((lap: any, i: number) => ({
        ...lap,
        total_distance: editedData[i]?.length || lap.total_distance,
        message_index: i,
      }));
    }

    // 3️⃣ Encode to a new FIT binary
    const encoder = new Encoder();

    const fitData = encoder.encode(
      new Messages(
        messages.file_id,
        messages.activity,
        messages.session,
        messages.lap,
        messages.length,
        messages.record,
        messages.event,
        messages.device_info,
        messages.developer_data_id,
        messages.field_description
      )
    );

    // 4️⃣ Write and send
    const outputPath = 'uploads/edited.fit';
    fs.writeFileSync(outputPath, fitData);

    res.setHeader('Content-Disposition', 'attachment; filename=edited.fit');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(fitData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
