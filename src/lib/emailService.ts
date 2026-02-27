import { Resend } from 'resend';
import React from 'react';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
  try {
    const html = await render(react);

    console.log(html, to, subject, react);
    await resend.emails.send({
      from: `HireFlow <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log('✅ Email sent:', subject);
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
}
