import { StatusCodes } from 'http-status-codes';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';
import AppError from '../../../errors/AppError';

const createBlogToDB = async (payload: Partial<IBlog>): Promise<IBlog> => {
  const blog = await Blog.create(payload);
  if (!blog) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create blog');
  }
  return blog;
};

const getAllBlogFromDB = async (): Promise<IBlog[]> => {
  const result = await Blog.find({}).sort({ createdAt: -1 });
  return result;
};

const getSingleBlogFromDB = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found');
  }
  return result;
};

const updateBlogToDB = async (id: string, payload: Partial<IBlog>): Promise<IBlog> => {
  const blog = await Blog.findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, payload, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found');
  }
  return blog;
};

const deleteBlogFromDB = async (id: string): Promise<IBlog> => {
  const blog = await Blog.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true },
  );
  if (!blog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found');
  }
  return blog;
};

export const BlogService = {
  createBlogToDB,
  getAllBlogFromDB,
  getSingleBlogFromDB,
  updateBlogToDB,
  deleteBlogFromDB,
};
