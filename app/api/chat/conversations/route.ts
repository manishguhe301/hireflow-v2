import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN, Role.JOB_SEEKER]);
    if (!guard.ok) return guard.response;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const isCompany = guard.session.user.role === Role.COMPANY_ADMIN;

    let conversations;
    let total;

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

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = { companyId: company.id };

      if (search) {
        where.OR = [
          { jobSeeker: { name: { contains: search, mode: 'insensitive' } } },
          {
            jobSeeker: {
              profile: { name: { contains: search, mode: 'insensitive' } },
            },
          },
          { job: { title: { contains: search, mode: 'insensitive' } } },
        ];
      }

      [conversations, total] = await Promise.all([
        prisma.conversation.findMany({
          where,
          include: {
            jobSeeker: {
              select: {
                id: true,
                name: true,
                email: true,
                profile: { select: { avatar: true, name: true } },
              },
            },
            job: { select: { id: true, title: true, slug: true } },
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
                  where: { isRead: false, senderType: 'JOB_SEEKER' },
                },
              },
            },
          },
          orderBy: { lastMessageAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.conversation.count({ where }),
      ]);
    } else {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const where: any = {
        jobSeekerId: guard.session.user.id,
        messages: { some: {} },
      };

      if (search) {
        where.OR = [
          { company: { name: { contains: search, mode: 'insensitive' } } },
          { job: { title: { contains: search, mode: 'insensitive' } } },
        ];
      }

      [conversations, total] = await Promise.all([
        prisma.conversation.findMany({
          where,
          include: {
            company: { select: { id: true, name: true, logo: true } },
            job: { select: { id: true, title: true, slug: true } },
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
                messages: { where: { isRead: false, senderType: 'COMPANY' } },
              },
            },
          },
          orderBy: { lastMessageAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.conversation.count({ where }),
      ]);
    }

    return NextResponse.json({
      conversations,
      pagination: {
        total,
        page,
        limit,
        hasMore: skip + conversations.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
