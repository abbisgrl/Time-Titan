export const emailTemplates = {
  inviteTeam: ({ inviteLink }: { inviteLink: string }) => ({
    subject: 'You’re Invited to Join Our Team!',
    htmlBody: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome to Our Team!</h2>
      <p>Hi there,</p>
      <p>We’re excited to invite you to join our team. Please click the button below to set your password and activate your account:</p>
      <p>
        <a 
          href="${inviteLink}" 
          style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
          target="_blank"
        >
          Set Your Password
        </a>
      </p>
      <p>If the button above doesn’t work, copy and paste the following link into your browser:</p>
      <p><a href="${inviteLink}" target="_blank">${inviteLink}</a></p>
      <p>We’re looking forward to having you onboard!</p>
      <p>Best regards,<br/>The Team</p>
    </div>
  `,
    textBody: `Welcome to Our Team!\n\nHi there,\n\nWe’re excited to invite you to join our team. Please use the following link to set your password and activate your account:\n\n${inviteLink}\n\nWe’re looking forward to having you onboard!\n\nBest regards,\nThe Team`,
  }),
};

const getEmailTemplate = (templateName: keyof typeof emailTemplates, data: any) => {
  const template = emailTemplates[templateName];
  if (!template) {
    throw new Error(`Email template "${templateName}" not found.`);
  }
  return template(data);
};

export default getEmailTemplate;
