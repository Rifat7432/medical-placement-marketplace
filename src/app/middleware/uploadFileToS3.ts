import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import fs from 'fs';
import path from 'path';
import config from '../../config';

// 🟦 AWS S3 client setup
const s3Client = new S3Client({
     region: config.aws.AWS_REGION!, // e.g. "us-east-1"
     credentials: {
          accessKeyId: config.aws.AWS_ACCESS_KEY!,
          secretAccessKey: config.aws.AWS_SECRET_KEY!,
     },
});

// 🔹 Upload local file → AWS S3 → always remove local temp file
const uploadFileToS3 = async (localFilePath: string) => {
     if (!fs.existsSync(localFilePath)) {
          throw new Error(`Local file not found: ${localFilePath}`);
     }

     const fileStream = fs.createReadStream(localFilePath);

     const ext = path.extname(localFilePath) || '';
     const contentType = mime.lookup(ext) || 'application/octet-stream';

     let folderName = 'others';
     if (contentType.startsWith('image/')) {
          folderName = 'image';
     } else if (contentType.startsWith('video/')) {
          folderName = 'video';
     }

     const generatedId = uuidv4();
     const fileName = `${folderName}/${generatedId}${ext || '.bin'}`;

     try {
          const command = new PutObjectCommand({
               Bucket: config.aws.AWS_BUCKET!,
               Key: fileName,
               Body: fileStream,
               ContentType: contentType,
          });

          await s3Client.send(command);

          console.log(`✅ Uploaded to S3: ${fileName}`);

          const fileUrl = `https://${config.aws.AWS_BUCKET}.s3.${config.aws.AWS_REGION}.amazonaws.com/${fileName}`;

          return {
               id: generatedId,
               type: folderName,
               url: fileUrl,
          };
     } catch (error) {
          console.error('❌ Error uploading to S3:', error);
          throw error;
     } finally {
          try {
               fs.unlinkSync(localFilePath);
               console.log(`🧹 Temp file deleted: ${localFilePath}`);
          } catch (err) {
               console.warn(`⚠️ Failed to delete temp file (${localFilePath}):`, err);
          }
     }
};

// 🔹 Delete file from AWS S3 by URL
const deleteFileFromS3 = async (fileUrl: string) => {
     try {
          const url = new URL(fileUrl);
          const key = decodeURIComponent(url.pathname.slice(1));

          const command = new DeleteObjectCommand({
               Bucket: config.aws.AWS_BUCKET!,
               Key: key,
          });

          await s3Client.send(command);

          console.log(`✅ Deleted from S3: ${key}`);
          return { success: true, key };
     } catch (error) {
          console.error('❌ Error deleting S3 file:', error);
          return { success: false, error };
     }
};

export { uploadFileToS3, deleteFileFromS3 };
