import express from 'express';
import { BlogController } from './blog.controller';
import { BlogValidation } from './blog.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.ADMIN), validateRequest(BlogValidation.createBlogZodSchema), BlogController.createBlog);
router.get('/', BlogController.getBlogs);
router.get('/:id', BlogController.getSingleBlog);

export const BlogRouter = router;
