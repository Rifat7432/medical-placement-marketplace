import { IContact, ICreateAccount, IEnquiryEmail, IHelpContact, IPlacementsEnquiryEmail, IResetPassword, IResetPasswordByEmail } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
     const data = {
          to: values.email,
          subject: 'Verify your account',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
         <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name ? values.name : 'There'}, Your Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 120px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
     };
     return data;
};
const contact = (values: IContact) => {
     const data = {
          to: values.email,
          subject: 'We’ve Received Your Message – Thank You!',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">      
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1742293522/buzzy-box-logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px; text-align: center;">Thank You for Contacting Us, ${values.name}!</h2>
          
          <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: center;">
              We have received your message and our team will get back to you as soon as possible.
          </p>
          
          <div style="padding: 15px; background-color: #f4f4f4; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; font-size: 16px; font-weight: bold;">Your Message Details:</p>
              <p><strong>Name:</strong> ${values.name}</p>
              <p><strong>Email:</strong> ${values.email}</p>
              <p><strong>Subject:</strong> ${values.subject}</p>
              <br/>
              <p><strong>Message:</strong> ${values.message}</p>
          </div>

          <p style="color: #555; font-size: 14px; text-align: center;">
              If your inquiry is urgent, feel free to reach out to us directly at 
              <a href="mailto:support@yourdomain.com" style="color: #277E16; text-decoration: none;">support@yourdomain.com</a>.
          </p>

          <p style="color: #555; font-size: 14px; text-align: center; margin-top: 20px;">
              Best Regards, <br/>
              The [Your Company Name] Team
          </p>
      </div>
  </body>`,
     };
     return data;
};
const resetPassword = (values: IResetPassword) => {
     const data = {
          to: values.email,
          subject: 'Reset your password',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 120px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
     };
     return data;
};
const resetPasswordByUrl = (values: IResetPasswordByEmail) => {
     const data = {
          to: values.email,
          subject: 'Reset Your Password',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Click the button below to reset it:</p>
          <a href="${values.resetUrl}" target="_blank" style="display: inline-block; background-color: #277E16; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 18px; margin: 20px auto;">Reset Password</a>
          <p style="color: #555; font-size: 16px; line-height: 1.5; margin-top: 20px;">If you didn’t request this, you can ignore this email.</p>
          <p style="color: #b9b4b4; font-size: 14px;">This link will expire in 10 minutes.</p>
        </div>
      </div>
    </body>`,
     };
     return data;
};

const contactFormTemplate = (values: IHelpContact) => {
     const data = {
          to: values.email,
          subject: 'Thank you for reaching out to us',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Hello ${values.name},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for reaching out to us. We have received your message:</p>
            <div style="background-color: #f1f1f1; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 20px;">
                <p style="color: #555; font-size: 16px; line-height: 1.5;">"${values.message}"</p>
            </div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We will get back to you as soon as possible. Below are the details you provided:</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Email: ${values.email}</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Phone: ${values.phone}</p>
            <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">If you need immediate assistance, please feel free to contact us directly at our support number.</p>
        </div>
    </div>
</body>`,
     };
     return data;
};
const sendEnquiryToAdmin = (values: IEnquiryEmail) => {
     const data = {
          to: process.env.ADMIN_EMAIL as string, // admin email
          subject: 'New Enquiry Received',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 25px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        
        <h2 style="color: #31ADA7; font-size: 24px; margin-bottom: 20px; text-align:center;">
          New Enquiry Received
        </h2>

        <p style="font-size: 16px; margin-bottom: 15px;">
          You have received a new enquiry from your website.
        </p>

        <div style="background-color: #f4f6f8; padding: 20px; border-radius: 8px;">
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Name:</strong> ${values.firstName} ${values.lastName}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Email:</strong> ${values.email}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Phone:</strong> ${values.phoneNumber}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Message:</strong></p>
          <div style="margin-top: 10px; padding: 15px; background-color: #fff; border-radius: 6px; border-left: 4px solid #31ADA7;">
            ${values.message}
          </div>
        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #888; text-align:center;">
          This email was generated automatically from the enquiry form.
        </p>

      </div>
    </body>`,
     };

     return data;
};
const sendPlacementsEnquiryToAdmin = (values: IPlacementsEnquiryEmail) => {
     const data = {
          to: process.env.ADMIN_EMAIL as string, // admin email
          subject: 'New Placement Enquiry Received',
          html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
      <div style="width: 100%; max-width: 650px; margin: 0 auto; padding: 25px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />

        <h2 style="color: #31ADA7; font-size: 24px; margin-bottom: 20px; text-align:center;">
          New Placement Enquiry
        </h2>

        <p style="font-size: 16px; margin-bottom: 20px; text-align:center;">
          A new placement enquiry has been submitted from the website.
        </p>

        <div style="background-color: #f4f6f8; padding: 20px; border-radius: 8px;">

          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Name:</strong> ${values.firstName} ${values.lastName}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Email:</strong> ${values.email}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Phone:</strong> ${values.phoneNumber}</p>

          <hr style="margin:15px 0; border:none; border-top:1px solid #ddd;" />

          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">University / Medical School:</strong> ${values.universityOrMedicalSchool}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Year of Study:</strong> ${values.yearOfStudy}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Preferred Start Date:</strong> ${values.preferredStartDate}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Duration:</strong> ${values.duration}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Preferred Specialty:</strong> ${values.preferredSpecialty}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Preferred Cities:</strong> ${values.preferredCities}</p>
          <p style="margin: 8px 0;"><strong style="color:#31ADA7;">Language:</strong> ${values.language}</p>

          ${
               values.documents && values.documents.length
                    ? `<p style="margin: 8px 0;">
                  <strong style="color:#31ADA7;">Documents:</strong><br/>
                  ${values.documents.map((doc) => `<a href="${doc}" style="color:#31ADA7; text-decoration:none;">View Document</a>`).join('<br/>')}
                </p>`
                    : ''
          }

          ${
               values.additionalInformation
                    ? `<p style="margin: 8px 0;"><strong style="color:#31ADA7;">Additional Information:</strong></p>
                 <div style="margin-top: 8px; padding: 15px; background-color: #fff; border-radius: 6px; border-left: 4px solid #31ADA7;">
                   ${values.additionalInformation}
                 </div>`
                    : ''
          }

        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #888; text-align:center;">
          This email was generated automatically from the placement enquiry form.
        </p>

      </div>
    </body>`,
     };

     return data;
};
export const emailTemplate = {
     createAccount,
     resetPassword,
     resetPasswordByUrl,
     contactFormTemplate,
     contact,
     sendEnquiryToAdmin,
     sendPlacementsEnquiryToAdmin,
};
