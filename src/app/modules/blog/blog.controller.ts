import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BlogService } from './blog.service';

const createBlog = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await BlogService.createBlogToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Blog created successfully',
    data: result,
  });
});

const getBlogs = catchAsync(async (req, res) => {
  const result = await BlogService.getAllBlogFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blogs retrieved successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogService.getSingleBlogFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog retrieved successfully',
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const result = await BlogService.updateBlogToDB(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const result = await BlogService.deleteBlogFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog deleted successfully',
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
