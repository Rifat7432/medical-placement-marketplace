import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { StudentPlacementEnquiry } from '../studentPlacementEnquiry/studentPlacementEnquiry.model';


const changeStudentPlacementEnquiryStatus = async (id: string, payload: Partial<{ status: 'pending' | 'approved' | 'rejected' }>) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(id);
     if (!studentPlacementEnquiry || studentPlacementEnquiry.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
     }

     if (payload.status === 'rejected') {
          const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { adminStatus: payload.status, stage: 'rejected', studentStatus: 'rejected' }, { new: true });
          return updatedEnquiry;
     }
     if (payload.status === 'approved') {
          const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { adminStatus: payload.status, stage: 'awaiting for payment', studentStatus: 'approved' }, { new: true });
          return updatedEnquiry;
     }
};

export const AdminService = {
     changeStudentPlacementEnquiryStatus,
};
