import Mailgun from 'mailgun.js';
import getEmailTemplate, { emailTemplates } from './Templates';
import FormData from 'form-data';

const sendEmail = async (toEmail: string, actionFor: keyof typeof emailTemplates, data: {}) => {
  const { subject, htmlBody, textBody } = getEmailTemplate(actionFor, data);

  const mailgun = new Mailgun(FormData);
  if (!process.env.MAILGUN_API_KEY) {
    throw new Error('MAILGUN_API_KEY is not defined');
  }
  const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

  mg.messages
    .create('sandbox3a66976aeb324dcaa54d1da192c281c1.mailgun.org', {
      from: 'shahgyanendra123@gmail.com',
      to: [toEmail],
      subject,
      text: textBody,
      html: htmlBody,
    })
    .then((msg) => console.log(msg))
    .catch((err) => console.log(err));
};

export default sendEmail;
