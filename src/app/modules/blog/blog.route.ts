import express from 'express';
import { BlogController } from './blog.controller';
import { BlogValidation } from './blog.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/', auth('admin'), validateRequest(BlogValidation.createBlogZodSchema), BlogController.createBlog);
router.get('/', BlogController.getBlogs);
router.get('/:id', BlogController.getSingleBlog);

export const BlogRouter = router;
