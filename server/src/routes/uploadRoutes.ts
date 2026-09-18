import { Router, Request, Response } from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { prisma } from '../utils/prisma.js';

const router = Router();

router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const record = await prisma.uploadedFile.create({
      data: {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        url: fileUrl,
        id: record.id,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
      message: 'File uploaded successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error uploading file' });
  }
});

export default router;
