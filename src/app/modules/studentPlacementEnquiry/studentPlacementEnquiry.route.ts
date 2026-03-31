import express, { NextFunction, Request, Response } from 'express';
import { StudentPlacementEnquiryController } from './studentPlacementEnquiry.controller';
import { StudentPlacementEnquiryValidation } from './studentPlacementEnquiry.validation';
import validateRequest from '../../middleware/validateRequest';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import uploadMulterFilesToS3 from '../../middleware/uploadMulterFilesToS3';

const router = express.Router();

router.get('/', StudentPlacementEnquiryController.getStudentPlacementEnquiries);
router.post(
     '/',
     fileUploadHandler(),
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               const uploadedFiles = await uploadMulterFilesToS3(req.files as Record<string, Express.Multer.File[]>);

               const documents: string[] = [];

               for (const fieldName in uploadedFiles) {
                    const value = uploadedFiles[fieldName];

                    if (Array.isArray(value)) {
                         value.forEach((file) => documents.push(file.url));
                    } else {
                         documents.push(value.url);
                    }
               }

               const data = JSON.parse(req.body?.data || '{}');

               req.body = {
                    ...data,
                    ...(documents.length > 0 && { documents }),
               };

               next();
          } catch (error) {
               next(error);
          }
     },
     validateRequest(StudentPlacementEnquiryValidation.createStudentPlacementEnquiryZodSchema),
     StudentPlacementEnquiryController.createStudentPlacementEnquiry,
);

router.get('/:id', StudentPlacementEnquiryController.getStudentPlacementEnquiry);
router.patch('/:id', validateRequest(StudentPlacementEnquiryValidation.updateStudentPlacementEnquiryZodSchema), StudentPlacementEnquiryController.updateStudentPlacementEnquiry);
router.delete('/:id', StudentPlacementEnquiryController.deleteStudentPlacementEnquiry);

export const StudentPlacementEnquiryRouter = router;
