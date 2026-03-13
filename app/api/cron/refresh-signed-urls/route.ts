import prisma from '@/src/lib/prisma';
import { getSignedUrl } from '@/src/lib/fileUpload';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { sendEmail } from '@/src/lib/emailService';
import SignedUrlFailureEmail from '@/src/emails/SignedUrlFailureEmail';

const EXPIRY = 60 * 60 * 24 * 7;

export async function GET(req: NextRequest) {
  try {
    const cronSecret = req.headers.get('x-cron-secret');
    const isLocalTest = process.env.NODE_ENV === 'development';

    if (cronSecret !== process.env.CRON_SECRET && !isLocalTest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting signed URL refresh cron');

    const [profiles, companies] = await Promise.all([
      prisma.profile.findMany({
        where: { avatarPath: { not: null } },
        select: { id: true, avatarPath: true },
      }),

      prisma.company.findMany({
        where: { logoPath: { not: null } },
        select: { id: true, logoPath: true },
      }),
    ]);

    let profileUpdates = 0;
    let companyUpdates = 0;

    await Promise.all([
      ...profiles.map(async (profile) => {
        if (!profile.avatarPath) return;

        const newUrl = await getSignedUrl(profile.avatarPath, EXPIRY);

        await prisma.profile.update({
          where: { id: profile.id },
          data: { avatar: newUrl },
        });

        profileUpdates++;
      }),

      ...companies.map(async (company) => {
        if (!company.logoPath) return;

        const newUrl = await getSignedUrl(company.logoPath, EXPIRY);

        await prisma.company.update({
          where: { id: company.id },
          data: { logo: newUrl },
        });

        companyUpdates++;
      }),
    ]);

    console.log('Signed URL refresh completed');

    return NextResponse.json({
      success: true,
      processed: {
        profiles: profiles.length,
        companies: companies.length,
        profileUpdates,
        companyUpdates,
      },
    });
  } catch (error) {
    console.error('Signed URL cron failed', error);

    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: '🚨 Signed URL Cron Failed',
      react: React.createElement(SignedUrlFailureEmail, {
        error: String(error),
        link: `${process.env.NEXT_PUBLIC_APP_URL}/api/cron/refresh-signed-urls`,
      }),
    });

    return NextResponse.json({ error: 'Cron Failed' }, { status: 500 });
  }
}
