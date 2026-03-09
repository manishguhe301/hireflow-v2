import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';
import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import { Role, ApplicationStatus } from '@prisma/client';
import { notifyUser } from '@/src/lib/notificationService';
import { getLabel } from '@/src/utils/helper';
import { APPLICATIONS_TABS } from '@/src/utils/constants';

export async function PATCH(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) return guard.response;

    const body = await req.json();
    const { applicationIds, action, status, rejectReason } = body as {
      applicationIds: string[];
      action: 'update_status' | 'reject';
      status?: ApplicationStatus;
      rejectReason?: string;
    };

    if (
      !applicationIds ||
      !Array.isArray(applicationIds) ||
      applicationIds.length === 0
    ) {
      return NextResponse.json(
        { error: 'Application IDs required' },
        { status: 400 },
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 },
      );
    }

    if (action === 'update_status' && !status) {
      return NextResponse.json(
        { error: 'Status is required for update action' },
        { status: 400 },
      );
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const applications = await prisma.application.findMany({
      where: {
        id: { in: applicationIds },
        job: { companyId: company.id },
      },
      select: {
        id: true,
        status: true,
        statusHistory: true,
        internalNotes: true,
        userId: true,
        job: { select: { title: true } },
      },
    });

    if (applications.length !== applicationIds.length) {
      return NextResponse.json(
        { error: 'Some applications not found or unauthorized' },
        { status: 403 },
      );
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

    if (action === 'update_status') {
      await Promise.all(
        applications.map(async (app) => {
          if (app.status === status) return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existingHistory = (app.statusHistory as any[]) || [];
          const newStatusIndex = STATUS_FLOW.indexOf(status!);

          const updatedHistory = existingHistory.filter((entry) => {
            const index = STATUS_FLOW.indexOf(entry.status);
            return index !== -1 && index <= newStatusIndex;
          });

          const existingIndex = updatedHistory.findIndex(
            (entry) => entry.status === status,
          );

          if (existingIndex !== -1) {
            updatedHistory[existingIndex] = { status, date: now };
          } else {
            updatedHistory.push({ status, date: now });
          }

          updatedHistory.sort(
            (a, b) =>
              STATUS_FLOW.indexOf(a.status) - STATUS_FLOW.indexOf(b.status),
          );

          await prisma.application.update({
            where: { id: app.id },
            data: {
              status,
              statusHistory: updatedHistory,
            },
          });
        }),
      );
    }

    if (action === 'reject') {
      await Promise.all(
        applications.map(async (app) => {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          const existingHistory = (app.statusHistory as any[]) || [];

          existingHistory.push({
            status: 'REJECTED',
            date: now,
          });

          await prisma.application.update({
            where: { id: app.id },
            data: {
              status: 'REJECTED',
              internalNotes: status === 'REJECTED' ? rejectReason : null,
              statusHistory: existingHistory,
            },
          });
        }),
      );
    }

    await Promise.all(
      applications.map((app) => {
        return notifyUser({
          title: 'Application Status Updated',
          message:
            action === 'update_status'
              ? `Application status updated to ${getLabel(APPLICATIONS_TABS, status)} for job ${app.job.title}`
              : ` Sorry, your application for job ${app.job.title} has been rejected.`,
          type: 'APPLICATION_STATUS_CHANGED',
          userId: app.userId,
          link: `/dashboard/applications`,
        });
      }),
    );

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${applicationIds.length} application${applicationIds.length > 1 ? 's' : ''}`,
    });
  } catch (error) {
    console.error('Bulk Action Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
