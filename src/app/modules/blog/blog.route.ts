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

const prepareBlogPayload = async (req: Request, _res: Response, next: NextFunction) => {
     try {
          const imageFiles = (req.files as Record<string, Express.Multer.File[]> | undefined)?.image;
          if (imageFiles && imageFiles.length > 1) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Only one blog image can be uploaded.');
          }

          const uploadedFiles = await uploadMulterFilesToS3(req.files as Record<string, Express.Multer.File[]>);
          const uploadedImage = uploadedFiles.image;

          if (Array.isArray(uploadedImage)) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Only one blog image can be uploaded.');
          }

          const data = typeof req.body?.data === 'string' ? JSON.parse(req.body.data) : req.body;
          req.body = {
               ...data,
               ...(uploadedImage && { image: uploadedImage.url }),
          };
          next();
     } catch (error) {
          next(error);
     }
};

router.post(
     '/',
     auth(USER_ROLES.ADMIN),
     fileUploadHandler(),
     prepareBlogPayload,
     validateRequest(BlogValidation.createBlogZodSchema),
     BlogController.createBlog,
);
router.get('/', BlogController.getBlogs);
router.get('/:id', validateRequest(BlogValidation.blogIdZodSchema), BlogController.getSingleBlog);
router.patch(
     '/:id',
     auth(USER_ROLES.ADMIN),
     fileUploadHandler(),
     prepareBlogPayload,
     validateRequest(BlogValidation.updateBlogZodSchema),
     BlogController.updateBlog,
);
router.delete(
     '/:id',
     auth(USER_ROLES.ADMIN),
     validateRequest(BlogValidation.blogIdZodSchema),
     BlogController.deleteBlog,
);

export const BlogRouter = router;
