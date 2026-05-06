import { StatusCodes } from 'http-status-codes';
import { IHospital } from './hospital.interface';
import { Hospital } from './hospital.model';
import AppError from '../../../errors/AppError';
import { Placement } from '../placement/placement.model';
import mongoose from 'mongoose';

const getHospitals = async (): Promise<IHospital[]> => {
     const hospitals = await Hospital.find({ isDeleted: false }).populate('userId', 'email');
     return hospitals;
};
const getHospitalProfile = async (id: string): Promise<IHospital | null> => {
     const hospital = await Hospital.findOne({ userId: id }).populate('userId', 'email');
     return hospital;
};

const getHospitalById = async (id: string): Promise<IHospital | null> => {
     const hospital = await Hospital.findById(id).populate('userId', 'email');
     return hospital;
};

const updateHospital = async (id: string, payload: Partial<IHospital>): Promise<IHospital | null> => {
     const hospital = await Hospital.findByIdAndUpdate(id, payload, { new: true });
     return hospital;
};

const deleteHospital = async (id: string): Promise<IHospital | null> => {
     const hospital = await Hospital.findByIdAndDelete(id);
     return hospital;
};
const hospitalOverview = async (id: string) => {
     const activePlacements = await Placement.find({
          hospitalId: new mongoose.Types.ObjectId(id),
          status: 'available',
          isDeleted: { $ne: true },
     }).countDocuments();
     const totalPlacements = Placement.countDocuments({ hospitalId: id, isDeleted: { $ne: true } });



     
     const recentPlacements = await Placement.find({
          isDeleted: { $ne: true },
     })
          .sort({ createdAt: -1 })
          .limit(10);

     const [activePlacementsData, totalPlacementsData] = await Promise.all([activePlacements, totalPlacements]);
     return { activePlacementsData, totalPlacementsData };
};
export const HospitalService = {
     hospitalOverview,
     getHospitals,
     getHospitalById,
     updateHospital,
     deleteHospital,

     getHospitalProfile,
};
