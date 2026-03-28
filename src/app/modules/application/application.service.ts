import { StatusCodes } from 'http-status-codes';
import { IApplication } from './application.interface';
import { Application } from './application.model';
import AppError from '../../../errors/AppError';

const createApplicationToDB = async (payload: Partial<IApplication>): Promise<IApplication> => {
  const application = await Application.create(payload);
  if (!application) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create application');
  }
  return application;
};

const getApplications = async (): Promise<IApplication[]> => {
  const applications = await Application.find();
  return applications;
};

const getApplicationById = async (id: string): Promise<IApplication | null> => {
  const application = await Application.findById(id);
  return application;
};

const updateApplication = async (id: string, payload: Partial<IApplication>): Promise<IApplication | null> => {
  const application = await Application.findByIdAndUpdate(id, payload, { new: true });
  return application;
};

const deleteApplication = async (id: string): Promise<IApplication | null> => {
  const application = await Application.findByIdAndDelete(id);
  return application;
};

export const ApplicationService = {
  createApplicationToDB,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};