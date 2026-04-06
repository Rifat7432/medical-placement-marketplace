import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { IUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../../errors/AppError';
import generateOTP from '../../../utils/generateOTP';
import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { Student } from '../student/student.model';
import { IStudent } from '../student/student.interface';
import { IHospital } from '../hospital/hospital.interface';
import { Hospital } from '../hospital/hospital.model';

// create user

// Create student user
const createStudentToDB = async (payload: Partial<IUser & IStudent>) => {
     // Check if user already exists
     const user = await User.findOne({ email: payload.email });
     if (user) {
          throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
     }

     // Development mode without transactions
     const createUser = await User.create({
          email: payload.email,
          password: payload.password,
          role: USER_ROLES.STUDENT,
     });

     await Student.create({
          userId: createUser._id,
          fullName: payload?.fullName,
     });

     if (!createUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
     }

     //send email
     const otp = generateOTP(4);
     const values = {
          name: createUser.email, // Use email as name since name field not in schema
          otp: otp,
          email: createUser.email!,
     };
     await User.findOneAndUpdate({ _id: createUser._id }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 5 * 60000) } });

     const createAccountTemplate = emailTemplate.createAccount(values);
     await emailHelper.sendEmail(createAccountTemplate);

     return values;
};

// Create admin user

// Create hospital user
const createHospitalToDB = async (payload: Partial<IUser & IHospital>) => {
     // Check if user already exists
     const user = await User.findOne({ email: payload.email });
     if (user) {
          throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
     }

     // Development mode without transactions
     const createUser = await User.create({
          email: payload.email,
          password: payload.password,
          role: USER_ROLES.HOSPITAL,
          verified: true,
     });

     await Hospital.create({
          userId: createUser._id,
          phone: payload.phone,
          hospitalName: payload.hospitalName,
          address: payload.address,
          website: payload.website,
          description: payload.description,
     });

     if (!createUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
     }

     //send email
     const values = {
          email: createUser.email,
          password: payload.password as string,
          hospitalName: payload.hospitalName as string,
     };
     const createAccountTemplate = emailTemplate.hospitalCredentialsTemplate(values);
     await emailHelper.sendEmail(createAccountTemplate);

     return values;
};

const handleGoogleAuthentication = async (payload: { email: string; googleId: string; name: string; email_verified: boolean; picture?: string }): Promise<any> => {
     const { email, googleId, email_verified } = payload;

     // Check if the user already exists by Google ID or email
     const existingUser = await User.findOne({ email }).select('+password');

     // If user doesn't exist, treat it as a sign-up
     if (!existingUser) {
          // Check if the user is signing up with Google and email is not already in use
          const userExists = await User.isExistUserByEmail(email);
          if (userExists) {
               throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
          }
          // Create the new user
          const newUser = await User.create({
               email,
               socialId: googleId,
               verified: email_verified,
               password: googleId,
               authProvider: 'google',
               role: USER_ROLES.STUDENT, // Only students can use social login
          });
          if (!newUser) {
               throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user');
          }
          await Student.create({
               userId: newUser._id,
          });
          if (newUser.verified) {
               const jwtData = { id: newUser._id, role: newUser.role, email: newUser.email };
               // create token
               const accessToken = jwtHelper.createToken(jwtData, config.jwt.jwt_secret as Secret, config.jwt.jwt_expire_in as string);
               const refreshToken = jwtHelper.createToken(jwtData, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expire_in as string);

               return { accessToken, refreshToken, message: 'Account created and verified successfully' };
          }
          const otp = generateOTP(4);
          const values = {
               name: newUser.email,
               otp,
               email: newUser.email,
          };
          await User.findOneAndUpdate({ _id: newUser._id }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 5 * 60000) } });
          // if (config.node_env === 'production') {
          const createAccountTemplate = emailTemplate.createAccount(values);
          await emailHelper.sendEmail(createAccountTemplate);

          // Save OTP for later verification

          //      return { message: 'Account created successfully, please verify via OTP' };
          // }
          return { message: 'Account created successfully, please verify via OTP', values };
     }
     // If user exists, perform login
     if (existingUser) {
          // check verified and status
          if (!existingUser.verified) {
               //send mail
               const otp = generateOTP(4);
               const value = { otp, email: existingUser.email };
               const forgetPassword = emailTemplate.resetPassword(value);
               await emailHelper.sendEmail(forgetPassword);

               //save to DB
               await User.findOneAndUpdate({ email }, { $set: { oneTimeCode: otp, OTPExpireAt: new Date(Date.now() + 15 * 60000) } });
               return { message: 'Account created successfully, please verify via OTP', value };
               throw new AppError(StatusCodes.CONFLICT, 'Please verify your account, then try to login again');
          }

          // check user status
          if (existingUser?.status === 'blocked') {
               throw new AppError(StatusCodes.BAD_REQUEST, 'You don’t have permission to access this content. It looks like your account has been blocked.');
          }

          const jwtData = { id: existingUser._id, role: existingUser.role, email: existingUser.email };
          // create token
          const accessToken = jwtHelper.createToken(jwtData, config.jwt.jwt_secret as Secret, config.jwt.jwt_expire_in as string);
          const refreshToken = jwtHelper.createToken(jwtData, config.jwt.jwt_refresh_secret as Secret, config.jwt.jwt_refresh_expire_in as string);

          return { accessToken, refreshToken };
     }

     throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'An unknown error occurred');
};

// get user profile
const getUserProfileFromDB = async (user: JwtPayload): Promise<Partial<IUser>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser || isExistUser.isDeleted) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};

const getUserFromDB = async (id: string): Promise<Partial<IUser>> => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser || isExistUser.isDeleted) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     return isExistUser;
};

// update user profile
const updateProfileToDB = async (user: JwtPayload, payload: Partial<IUser>): Promise<Partial<IUser | null>> => {
     const { id } = user;
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser || isExistUser.isDeleted) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }

     const updateDoc = await User.findOneAndUpdate(
          { _id: id },
          { ...payload },
          {
               new: true,
          },
     );

     return updateDoc;
};

const verifyUserPassword = async (userId: string, password: string) => {
     const user = await User.findById(userId).select('+password');
     if (!user) {
          throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
     }
     const isPasswordValid = await User.isMatchPassword(password, user.password as string);
     return isPasswordValid;
};

const blockUserToDB = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     if (isExistUser.role === USER_ROLES.ADMIN) {
          throw new AppError(StatusCodes.BAD_REQUEST, "You don't have permission to block this user!");
     }
     await User.findByIdAndUpdate(id, {
          $set: { status: 'blocked' },
     });

     return true;
};
const deleteUser = async (id: string) => {
     const isExistUser = await User.isExistUserById(id);
     if (!isExistUser) {
          throw new AppError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
     }
     if (isExistUser.role === USER_ROLES.ADMIN) {
          throw new AppError(StatusCodes.BAD_REQUEST, "You don't have permission to delete this user!");
     }
     await User.findByIdAndUpdate(id, {
          $set: { isDeleted: true },
     });

     return true;
};
export const UserService = {
     createStudentToDB,

     createHospitalToDB,
     getUserProfileFromDB,
     updateProfileToDB,
     deleteUser,
     verifyUserPassword,
     handleGoogleAuthentication,
     getUserFromDB,
     blockUserToDB,
};
