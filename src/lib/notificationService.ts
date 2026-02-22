import { NotificationType } from '@prisma/client';
import prisma from './prisma';

interface NotifyUserParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
}

export async function notifyUser({
  message,
  title,
  type,
  userId,
  link,
  metadata,
}: NotifyUserParams) {
  try {
    await prisma.notification.create({
      data: {
        type,
        title,
        message,
        link,
        metadata,
        userId,
      },
    });
    console.log('Notification sent successfully!', { userId, type, title });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
