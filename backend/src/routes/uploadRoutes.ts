import { Router } from 'express';
import multer from 'multer';
import { handleImageUpload } from '../controllers/uploadController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Memory storage is best for S3

// Route to handle the POST request
router.post('/image', upload.single('image'), handleImageUpload);

export default router;