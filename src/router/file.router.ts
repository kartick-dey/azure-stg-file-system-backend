import { Router } from 'express';
import { FileUploadService } from '../service/file.service';
import { FileUploadController } from '../controller/file.controller';
import multer, { memoryStorage, Multer, StorageEngine } from 'multer';

const router = Router();

const svc = new FileUploadService();
const ctrl = new FileUploadController(svc);

// Configure multer for file storage
const storage: StorageEngine = memoryStorage(); // Store files in memory (can use disk storage if needed)
const upload: Multer = multer({ storage });

router.post('/upload', upload.single('chunk'), ctrl.uploadFileChunkCtrl);
router.get('/:id/download', ctrl.downloadFileFromDirectory);

export default router;
