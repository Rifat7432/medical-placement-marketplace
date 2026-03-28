import { StatusCodes } from 'http-status-codes';
import { IHospital } from './hospital.interface';
import { Hospital } from './hospital.model';
import AppError from '../../../errors/AppError';

const createHospitalToDB = async (payload: Partial<IHospital>): Promise<IHospital> => {
  const hospital = await Hospital.create(payload);
  if (!hospital) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create hospital');
  }
  return hospital;
};

const getHospitals = async (): Promise<IHospital[]> => {
  const hospitals = await Hospital.find();
  return hospitals;
};

const getHospitalById = async (id: string): Promise<IHospital | null> => {
  const hospital = await Hospital.findById(id);
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
  createHospitalToDB,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
};