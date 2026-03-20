import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { Role, ApplicationStatus } from '@prisma/client';
import { notifyUser } from '@/src/lib/notificationService';
import { getLabel } from '@/src/utils/helper';
import { APPLICATIONS_TABS } from '@/src/utils/constants';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) return guard.response;

    const { id } = await params;
    const body = await req.json();

    const { status, internalNotes } = body as {
      status: ApplicationStatus;
      internalNotes?: string;
    };

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 },
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { select: { companyId: true, title: true } },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 },
      );
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true },
    });

    if (!company || company.id !== application.job.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    //eslint-disable-next-line
    const existingHistory = (application.statusHistory as any[]) || [];

    if (application.status === status) {
      return NextResponse.json({
        success: true,
        application,
      });
    }

    const STATUS_FLOW: ApplicationStatus[] = [
      'APPLIED',
      'REVIEWING',
      'SHORTLISTED',
      'INTERVIEW_SCHEDULED',
      'OFFERED',
      'HIRED',
      'REJECTED',
    ];

    const now = new Date().toISOString();
    const newStatusIndex = STATUS_FLOW.indexOf(status);

    const updatedHistory = existingHistory.filter((entry) => {
      const index = STATUS_FLOW.indexOf(entry.status);
      return index !== -1 && index <= newStatusIndex;
    });

    const existingIndex = updatedHistory.findIndex(
      (entry) => entry.status === status,
    );

    if (existingIndex !== -1) {
      updatedHistory[existingIndex] = {
        status,
        date: now,
      };
    } else {
      updatedHistory.push({
        status,
        date: now,
      });
    }

    updatedHistory.sort(
      (a, b) => STATUS_FLOW.indexOf(a.status) - STATUS_FLOW.indexOf(b.status),
    );

    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status,
        internalNotes: status === 'REJECTED' ? internalNotes || '' : null,
        statusHistory: updatedHistory,
      },
    });

    if (status === 'REJECTED') {
      const conversation = await prisma.conversation.findFirst({
        where: {
          jobId: application.jobId,
          jobSeekerId: application.userId,
        },
        select: { id: true },
      });

      if (conversation) {
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { isApplicationWithdrawn: true },
        });
      }
    }

    await notifyUser({
      title: 'Application Status Updated',
      message:
        status === 'REJECTED'
          ? ` Sorry, your application for job ${application.job.title} has been rejected.`
          : `Application status updated to ${getLabel(APPLICATIONS_TABS, status)} for job ${application.job.title}`,
      type: 'APPLICATION_STATUS_CHANGED',
      userId: application.userId,
      link: `/dashboard/applications`,
      metadata: {
        applicationId: application.id,
        jobId: application.jobId,
        jobTitle: application.job.title,
        applicantId: guard.session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Update Application Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
