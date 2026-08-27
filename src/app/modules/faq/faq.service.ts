import { StatusCodes } from 'http-status-codes';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';
import AppError from '../../../errors/AppError';

const createFaqToDB = async (payload: Partial<IFaq>): Promise<IFaq> => {
  const faq = await Faq.create(payload);
  if (!faq) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create FAQ');
  }
  return faq;
};

const getAllFaqFromDB = async (): Promise<IFaq[]> => {
  const result = await Faq.find({}).sort({ createdAt: -1 });
  return result;
};

const getSingleFaqFromDB = async (id: string): Promise<IFaq | null> => {
  const result = await Faq.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'FAQ not found');
  }
  return result;
};

const updateFaqToDB = async (id: string, payload: Partial<IFaq>): Promise<IFaq> => {
  const faq = await Faq.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    payload,
    { new: true, runValidators: true },
  );
  if (!faq) {
    throw new AppError(StatusCodes.NOT_FOUND, 'FAQ not found');
  }
  return faq;
};

const deleteFaqFromDB = async (id: string): Promise<IFaq> => {
  const faq = await Faq.findOneAndUpdate(
    { _id: id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true },
  );
  if (!faq) {
    throw new AppError(StatusCodes.NOT_FOUND, 'FAQ not found');
  }
  return faq;
};

export const FaqService = {
  createFaqToDB,
  getAllFaqFromDB,
  getSingleFaqFromDB,
  updateFaqToDB,
  deleteFaqFromDB,
};
