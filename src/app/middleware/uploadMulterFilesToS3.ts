import { uploadFileToS3 } from './uploadFileToS3';

export type UploadedFile = {
  id: string;
  type: string;
  url: string;
};

type MulterFiles = Record<string, Express.Multer.File[]>;

const uploadMulterFilesToS3 = async (
  files: MulterFiles | undefined
): Promise<Record<string, UploadedFile | UploadedFile[]>> => {
  const result: Record<string, UploadedFile | UploadedFile[]> = {};

  if (!files) return result;

  const uploadTasks: Promise<void>[] = [];

  for (const fieldName in files) {
    const fieldFiles = files[fieldName];

    if (!Array.isArray(fieldFiles) || fieldFiles.length === 0) continue;

    uploadTasks.push(
      (async () => {
        if (fieldFiles.length === 1) {
          const uploaded = await uploadFileToS3(fieldFiles[0].path);
          result[fieldName] = uploaded;
        } else {
          const uploads = await Promise.all(
            fieldFiles.map((file) => uploadFileToS3(file.path))
          );
          result[fieldName] = uploads;
        }
      })()
    );
  }

  await Promise.all(uploadTasks);

  return result;
};

export default uploadMulterFilesToS3;