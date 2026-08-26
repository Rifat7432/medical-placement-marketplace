import express, { NextFunction, Request, Response } from 'express';
import { BlogController } from './blog.controller';
import { BlogValidation } from './blog.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middleware/fileUploadHandler';
import uploadMulterFilesToS3 from '../../middleware/uploadMulterFilesToS3';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';

const router = express.Router();

router.post('/', fileUploadHandler(),
     async (req: Request, res: Response, next: NextFunction) => {
          try {
               const uploadedFiles = await uploadMulterFilesToS3(req.files as Record<string, Express.Multer.File[]>);

               let image = null;

               for (const fieldName in uploadedFiles) {
                    const value = uploadedFiles[fieldName];

                    if (Array.isArray(value)) {
                         throw new AppError(StatusCodes.BAD_REQUEST, `Multiple files uploaded Profile Image, expected only one.`);
                    } else {
                         image = value.url;
                    }
               }

               const data = JSON.parse(req.body?.data || '{}');

               req.body = {
                    ...data,
                   ...( image && { image })
               };

               next();
          } catch (error) {
               next(error);
          }
     }, auth(USER_ROLES.ADMIN), validateRequest(BlogValidation.createBlogZodSchema), BlogController.createBlog);
router.get('/', BlogController.getBlogs);
router.get('/:id', BlogController.getSingleBlog);

export const BlogRouter = router;
