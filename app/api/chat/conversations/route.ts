import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN, Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const isCompany = guard.session.user.role === Role.COMPANY_ADMIN;

    let conversations;

    if (isCompany) {
      const company = await prisma.company.findUnique({
        where: { userId: guard.session.user.id },
        select: { id: true },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 },
        );
      }

      conversations = await prisma.conversation.findMany({
        where: { companyId: company.id },
        include: {
          jobSeeker: {
            select: {
              id: true,
              name: true,
              email: true,
              profile: {
                select: {
                  avatar: true,
                },
              },
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              content: true,
              isRead: true,
              createdAt: true,
              senderType: true,
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  senderType: 'JOB_SEEKER',
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
    } else {
      conversations = await prisma.conversation.findMany({
        where: { jobSeekerId: guard.session.user.id },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              content: true,
              isRead: true,
              createdAt: true,
              senderType: true,
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  isRead: false,
                  senderType: 'COMPANY',
                },
              },
            },
          },
        },
        orderBy: { lastMessageAt: 'desc' },
      });
    }

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
