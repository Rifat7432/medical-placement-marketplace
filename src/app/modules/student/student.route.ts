import express, { NextFunction, Request, Response } from 'express';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import uploadMulterFilesToS3 from '../../middleware/uploadMulterFilesToS3';
import AppError from '../../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

// router.get('/', StudentController.getStudents);

router.get(
     '/profile',
     auth(USER_ROLES.STUDENT),

     StudentController.getStudentProfile,
);
router.get('/:id', StudentController.getStudent);
router.patch(
     '/',
     auth(USER_ROLES.STUDENT),
     fileUploadHandler(),
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               const uploadedFiles = await uploadMulterFilesToS3(req.files as Record<string, Express.Multer.File[]>);

               let profileImage = null;

               for (const fieldName in uploadedFiles) {
                    const value = uploadedFiles[fieldName];

                    if (Array.isArray(value)) {
                         throw new AppError(StatusCodes.BAD_REQUEST, `Multiple files uploaded Profile Image, expected only one.`);
                    } else {
                         profileImage = value.url;
                    }
               }

               const data = JSON.parse(req.body?.data || '{}');

               req.body = {
                    ...data,
                   ...( profileImage && { profileImage })
               };

               next();
          } catch (error) {
               next(error);
          }
     },
     validateRequest(StudentValidation.updateStudentZodSchema),
     StudentController.updateStudent,
);
router.get('/dashboard/overview', auth(USER_ROLES.STUDENT), StudentController.getStudentDashboard);

export const StudentRouter = router;
