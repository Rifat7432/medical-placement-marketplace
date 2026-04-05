import FormData from 'form-data';
import Mailgun from 'mailgun.js';

import colors from 'colors';
import { ISendEmail } from '../types/email';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';

// Initialize Mailgun client
const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
     username: 'api',
     key: config.email.apiKey,
     url: config.email.endpoint || 'https://api.eu.mailgun.net',
});

const DOMAIN = config.email.domain;

// Send email (to user)
export const sendEmail = async (values: ISendEmail) => {
     try {
          const data = await mg.messages.create(DOMAIN, {
               from: `${config.email.emailHeader} <${config.email.from}>`,
               to: [values.to],
               subject: values.subject,
               html: values.html,
          });

          logger.info(colors.green(`✅ [Medical Placement Marketplace] Email sent successfully: ${data.id}`));
     } catch (error) {
          errorLogger.error(colors.red('[Medical Placement Marketplace] Email Error:'), error);
     }
};

// Send email to admin (for contact forms, notifications, etc.)
export const sendEmailForAdmin = async (values: ISendEmail) => {
     try {
          const data = await mg.messages.create(DOMAIN, {
               from: `"${values.to}" <${values.to}>`,
               // to: [config.email.user],
               to: ['md.rifat.taluckdar@gmail.com'],
               subject: values.subject,
               html: values.html,
          });
console.log(data)
          logger.info(colors.green(`✅ [Medical Placement Marketplace] Admin email sent: ${data.id}`));
     } catch (error) {
          errorLogger.error(colors.red('[Medical Placement Marketplace] Admin Email Error:'), error);
     }
};

export const emailHelper = {
     sendEmail,
     sendEmailForAdmin,
};
