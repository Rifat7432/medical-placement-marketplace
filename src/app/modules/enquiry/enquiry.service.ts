import { StatusCodes } from 'http-status-codes';
import { IEnquiry } from './enquiry.interface';
import { Enquiry } from './enquiry.model';
import AppError from '../../../errors/AppError';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';

const createEnquiryToDB = async (payload: Partial<IEnquiry>): Promise<IEnquiry> => {
     const enquiry = await Enquiry.create(payload);
     if (!enquiry) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create enquiry');
     }
     const values = {
          email: enquiry.email,
          firstName: enquiry.firstName,
          lastName: enquiry.lastName,
          phoneNumber: enquiry.phoneNumber,
          message: enquiry.message,
     };
     const enquiryTemplate = emailTemplate.sendEnquiryToAdmin(values);
     await emailHelper.sendEmailForSupport(enquiryTemplate);
     return enquiry;
};

export const EnquiryService = {
     createEnquiryToDB,
};
