import { StatusCodes } from 'http-status-codes';
import { IHospital } from './hospital.interface';
import { Hospital } from './hospital.model';
import AppError from '../../../errors/AppError';



const getHospitals = async (): Promise<IHospital[]> => {
  const hospitals = await Hospital.find({ isDeleted: false }).populate('userId', 'email');
  return hospitals;
};
const getHospitalProfile = async (id: string): Promise<IHospital | null> => {
  const hospital = await Hospital.findById(id).populate('userId', 'email');
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

export const HospitalService = {
 
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,

  getHospitalProfile
};