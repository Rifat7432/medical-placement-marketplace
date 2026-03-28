export type ICreateAccount = {
     name?: string;
     email: string;
     otp: number;
};

export type IResetPassword = {
     email: string;
     otp: number;
};
export interface IResetPasswordByEmail {
     email: string;
     resetUrl: string;
}
export interface IHelpContact {
     name: string;
     email: string;
     phone?: string;
     read: boolean;
     message: string;
}
export type IContact = {
     name: string;
     email: string;
     subject: string;
     message: string;
};
export type IEnquiryEmail = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  message: string;
};
export type IPlacementsEnquiryEmail = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  universityOrMedicalSchool: string;
  yearOfStudy: number;
  preferredStartDate: string;
  duration: string;
  preferredSpecialty: string;
  preferredCities: string;
  language: string;
  documents?: string[];
  additionalInformation?: string;
};
