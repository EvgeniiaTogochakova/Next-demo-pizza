import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  template: React.ReactNode,
) => {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text: '',
    react: template,
  });

  if (error) {
    throw error;
  }

  return data;
};

// чистая серверная (server) функция
