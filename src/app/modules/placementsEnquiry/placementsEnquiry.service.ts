import { StatusCodes } from 'http-status-codes';
import { IPlacementsEnquiry } from './placementsEnquiry.interface';
import { PlacementsEnquiry } from './placementsEnquiry.model';
import AppError from '../../../errors/AppError';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';

const createPlacementsEnquiryToDB = async (payload: Partial<IPlacementsEnquiry>): Promise<IPlacementsEnquiry> => {
     const placementsEnquiry = await PlacementsEnquiry.create(payload);
     if (!placementsEnquiry) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create placements enquiry');
     }
     const values = {
          email: placementsEnquiry.email,
          firstName: placementsEnquiry.firstName,
          lastName: placementsEnquiry.lastName,
          phoneNumber: placementsEnquiry.phoneNumber,
          universityOrMedicalSchool: placementsEnquiry.universityOrMedicalSchool,
          yearOfStudy: placementsEnquiry.yearOfStudy,
          preferredStartDate: placementsEnquiry.preferredStartDate,
          duration: placementsEnquiry.duration,
          preferredSpecialty: placementsEnquiry.preferredSpecialty,
          preferredCities: placementsEnquiry.preferredCities,
          language: placementsEnquiry.language,
          documents: placementsEnquiry.documents,
          additionalInformation: placementsEnquiry.additionalInformation,
     };
     const enquiryTemplate = emailTemplate.sendPlacementsEnquiryToAdmin(values);
     await emailHelper.sendEmailForAdmin(enquiryTemplate);
     return placementsEnquiry;
};

export const PlacementsEnquiryService = {
     createPlacementsEnquiryToDB,
};
