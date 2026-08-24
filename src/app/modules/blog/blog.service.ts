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

export const BlogService = {
  createBlogToDB,
  getAllBlogFromDB,
  getSingleBlogFromDB,
};
