import { model, Schema } from 'mongoose';
import { IBlog, BlogModel } from './blog.interface';

const blogSchema = new Schema<IBlog, BlogModel>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Exist Blog Check
blogSchema.statics.isExistBlogById = async (id: string) => {
  return await Blog.findById(id);
};

// Query Middleware
blogSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

blogSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

blogSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Blog = model<IBlog, BlogModel>('Blog', blogSchema);
