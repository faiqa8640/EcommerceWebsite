
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const fileKey = `${folder}/${Date.now()}-${file.originalname}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};


export const generatePresignedUrl = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileKey,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// ─── Shared helper: turn a raw/stored S3 URL into a usable (signed) URL ──────
// Centralizing this means every controller (products, categories, etc.)
// signs URLs the exact same way — no more "works on one page, broken on another".
export const resolveS3Url = async (url: string | undefined | null): Promise<string> => {
  if (!url) return "";

  // Not an S3 URL (e.g. a local /public asset like "/about-shop.jpg") — leave it alone
  if (!url.includes("amazonaws.com/")) return url;

  const parts = url.split(".amazonaws.com/");
  const key = parts[1];

  if (!key || key.length === 0) return url;

  try {
    return await generatePresignedUrl(key);
  } catch (err) {
    console.error("⚠️ Error generating presigned URL for key:", key, err);
    return url; // fallback so the app doesn't crash — but this will 403 in the browser
  }
};

// Resolve every image in an array (used for product.images, etc.)
export const resolveS3Urls = async (urls: (string | undefined | null)[] = []): Promise<string[]> => {
  return Promise.all(urls.map((u) => resolveS3Url(u)));
};

// ─── Delete a single S3 object given its full stored URL ─────────────────
// Pass in the raw URL exactly as stored in MongoDB (img / bannerImg / one
// entry of images[]). Safely no-ops on local/non-S3 URLs so it's safe to
// call unconditionally from delete controllers.
export const deleteFileFromS3 = async (url: string | undefined | null): Promise<void> => {
  if (!url) return;
  if (!url.includes("amazonaws.com/")) return; // not an S3 URL, nothing to delete

  const parts = url.split(".amazonaws.com/");
  const key = parts[1];
  if (!key) return;

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
    );
  } catch (err) {
    // Don't let an S3 cleanup failure block the DB delete from completing —
    // just log it so it can be cleaned up manually if needed.
    console.error("⚠️ Error deleting S3 object for key:", key, err);
  }
};

// Delete multiple S3 objects (used for product.images, etc.)
export const deleteFilesFromS3 = async (urls: (string | undefined | null)[] = []): Promise<void> => {
  await Promise.all(urls.map((u) => deleteFileFromS3(u)));
};
