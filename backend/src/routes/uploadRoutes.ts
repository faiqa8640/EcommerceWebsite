import { Router } from 'express';
import multer from 'multer';// multer middleware here 
import { handleImageUpload } from '../controllers/uploadController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Memory storage is best for S3
// where uploaded file is temporory stored -> stored ion ram 
// Route to handle the POST request
router.post('/image', upload.single('image'), handleImageUpload);

export default router;