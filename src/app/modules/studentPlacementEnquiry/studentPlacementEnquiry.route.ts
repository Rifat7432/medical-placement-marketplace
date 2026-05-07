import express, { NextFunction, Request, Response } from 'express';
import { StudentPlacementEnquiryController } from './studentPlacementEnquiry.controller';
import { StudentPlacementEnquiryValidation } from './studentPlacementEnquiry.validation';
import validateRequest from '../../middleware/validateRequest';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import uploadMulterFilesToS3 from '../../middleware/uploadMulterFilesToS3';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.STUDENT), StudentPlacementEnquiryController.getStudentPlacementEnquiries);
router.get('/admin', auth(USER_ROLES.ADMIN), StudentPlacementEnquiryController.getStudentPlacementEnquiriesForAdmin);
router.get('/hospital', auth(USER_ROLES.HOSPITAL), StudentPlacementEnquiryController.getStudentPlacementEnquiriesForHospital);
router.post(
     '/',
     auth(USER_ROLES.STUDENT),
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

router.get('/:id', auth(USER_ROLES.STUDENT, USER_ROLES.ADMIN, USER_ROLES.HOSPITAL), StudentPlacementEnquiryController.getStudentPlacementEnquiryForStudent);
router.get('/hospital/:id', auth(USER_ROLES.HOSPITAL), StudentPlacementEnquiryController.getStudentPlacementEnquiryForHospital);
router.get('/admin/:id', auth(USER_ROLES.ADMIN), StudentPlacementEnquiryController.getStudentPlacementEnquiryForAdmin);





router.patch('/choose/:id',auth(USER_ROLES.STUDENT), validateRequest(StudentPlacementEnquiryValidation.chooseStudentPlacementEnquiryZodSchema), StudentPlacementEnquiryController.chooseStudentPlacementEnquiry);

// router.patch('/:id', validateRequest(StudentPlacementEnquiryValidation.updateStudentPlacementEnquiryZodSchema), StudentPlacementEnquiryController.updateStudentPlacementEnquiry);

// router.delete('/:id', StudentPlacementEnquiryController.deleteStudentPlacementEnquiry);

export const StudentPlacementEnquiryRouter = router;
