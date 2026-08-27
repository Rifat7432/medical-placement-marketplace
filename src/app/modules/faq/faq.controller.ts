import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FaqService } from './faq.service';

const createFaq = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await FaqService.createFaqToDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'FAQ created successfully',
    data: result,
  });
});

const getFaqs = catchAsync(async (req, res) => {
  const result = await FaqService.getAllFaqFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Faqs retrieved successfully',
    data: result,
  });
});

const getSingleFaq = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FaqService.getSingleFaqFromDB(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Faq retrieved successfully',
    data: result,
  });
});

const updateFaq = catchAsync(async (req, res) => {
  const result = await FaqService.updateFaqToDB(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'FAQ updated successfully',
    data: result,
  });
});

const deleteFaq = catchAsync(async (req, res) => {
  const result = await FaqService.deleteFaqFromDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'FAQ deleted successfully',
    data: result,
  });
});

export const FaqController = {
  createFaq,
  getFaqs,
  getSingleFaq,
  updateFaq,
  deleteFaq,
};
