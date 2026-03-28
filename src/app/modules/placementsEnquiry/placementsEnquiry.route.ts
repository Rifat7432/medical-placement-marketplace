import express, { NextFunction, Request, Response } from 'express';
import { PlacementsEnquiryController } from './placementsEnquiry.controller';
import { PlacementsEnquiryValidation } from './placementsEnquiry.validation';
import validateRequest from '../../middleware/validateRequest';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import moveImagesVideosToS3 from '../../middleware/moveImagesVideosToS3';

const router = express.Router();

router.post(
     '/',
     fileUploadHandler(),
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               // 🔹 Upload image/video files from local → S3
               const s3Uploads = await moveImagesVideosToS3(req.files);

               // pick S3 URL (single or first item if multiple)
               const image = Array.isArray(s3Uploads.image) ? s3Uploads.image[0].url : s3Uploads.image?.url;

               // merge request body
               const data = JSON.parse(req.body?.data || '{}');
               // normalize legacy fields on multipart payload
               req.body = image ? { image, ...data } : { ...data };

               next();
          } catch (error) {
               next(error);
          }
     },
     validateRequest(PlacementsEnquiryValidation.createPlacementsEnquiryZodSchema),
     PlacementsEnquiryController.createPlacementsEnquiry,
);

export const PlacementsEnquiryRouter = router;
