import { StatusCodes } from 'http-status-codes';
import { IStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../../errors/AppError';
import { StudentPlacementEnquiry } from '../studentPlacementEnquiry/studentPlacementEnquiry.model';
import { Notification } from '../notification/notification.model';


const getStudentDashboard = async (id: string) => {
     console.log(id)
     const placements = await StudentPlacementEnquiry.find({ studentId: id });
      const result = await Notification.find({ receiver: id }).sort({ createdAt: -1 });
     return {
          allApplications: placements,
          total: placements.length,
          pending: placements.filter((p) => p.studentStatus === 'pending').length,
          approved: placements.filter((p) => p.studentStatus === 'approved').length,
          rejected: placements.filter((p) => p.studentStatus === 'rejected').length,
          notifications: result,
     };
};
const getStudents = async (): Promise<IStudent[]> => {
     const students = await Student.find();
     return students;
};

const getStudentById = async (id: string): Promise<IStudent | null> => {
     const student = await Student.findById(id);
     return student;
};

const getStudentProfileFromDB = async (id: string): Promise<IStudent | null> => {
     const student = await Student.findOne({ userId: id }).populate('userId', 'email');
     return student;
};

const updateStudent = async (id: string, payload: Partial<IStudent>): Promise<IStudent | null> => {
     const student = await Student.findOneAndUpdate({ userId: id }, payload, { new: true });
     return student;
};

const deleteStudent = async (id: string): Promise<IStudent | null> => {
     const student = await Student.findByIdAndDelete(id);
     return student;
};

export const StudentService = {
     getStudents,
     getStudentById,
     updateStudent,
     deleteStudent,

     getStudentDashboard,
     getStudentProfileFromDB,
};
