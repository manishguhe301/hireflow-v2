import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import prisma from '@/src/lib/prisma';
import { generateSlug } from '@/src/utils/helper';
import {
  EmploymentType,
  ExperienceLevel,
  JobStatus,
  Role,
  WorkMode,
} from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        {
          error:
            'Company profile not found. Please create your company profile first.',
        },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as JobStatus | null;

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      companyId: company.id,
    };

    if (status) {
      where.status = status;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = generateSlug(title).substring(0, 50);

  const randomString = Math.random().toString(36).substring(2, 8);
  const slug = `${baseSlug}-${randomString}`;

  const existing = await prisma.job.findUnique({ where: { slug } });
  if (existing) {
    return generateUniqueSlug(title);
  }

  return slug;
}

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        {
          error:
            'Company profile not found. Please create your company profile first.',
        },
        { status: 404 },
      );
    }

    if (company.status !== 'APPROVED') {
      return NextResponse.json(
        {
          error: `Your company profile must be approved before posting jobs. Current status: ${company.status}`,
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      responsibilities: formData.get('responsibilities') as string | null,
      skills: formData.get('skills') as string,
      experienceLevel: formData.get('experienceLevel') as string,
      employmentType: formData.get('employmentType') as string,
      workMode: formData.get('workMode') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string | null,
      salaryMin: formData.get('salaryMin') as string | null,
      salaryMax: formData.get('salaryMax') as string | null,
      hideSalary: formData.get('hideSalary') as string,
      numberOfOpenings: formData.get('numberOfOpenings') as string,
      applicationDeadline: formData.get('applicationDeadline') as string | null,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
    };

    if (
      !data.title ||
      !data.description ||
      !data.requirements ||
      !data.skills ||
      !data.experienceLevel ||
      !data.employmentType ||
      !data.workMode ||
      !data.country ||
      !data.category
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    let skillsArray: string[] = [];
    try {
      skillsArray = JSON.parse(data.skills);
    } catch (error) {
      console.error('Error parsing skills:', error);
      return NextResponse.json(
        { error: 'Invalid skills format' },
        { status: 400 },
      );
    }

    const slug = await generateUniqueSlug(data.title);

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities || null,
        skills: skillsArray,
        experienceLevel: data.experienceLevel as ExperienceLevel,
        employmentType: data.employmentType as EmploymentType,
        workMode: data.workMode as WorkMode,
        country: data.country,
        city: data.city || null,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : null,
        hideSalary: data.hideSalary === 'true',
        numberOfOpenings: parseInt(data.numberOfOpenings),
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline)
          : null,
        category: data.category,
        slug,
        status: data.status as JobStatus,
        views: 0,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        job,
        message:
          data.status === 'DRAFT'
            ? 'Job saved as draft'
            : 'Job posted successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const jobId = formData.get('jobId') as string;

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 },
      );
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (existingJob.companyId !== company.id) {
      return NextResponse.json(
        { error: 'Unauthorized: This job does not belong to your company' },
        { status: 403 },
      );
    }

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      requirements: formData.get('requirements') as string,
      responsibilities: formData.get('responsibilities') as string | null,
      skills: formData.get('skills') as string,
      experienceLevel: formData.get('experienceLevel') as string,
      employmentType: formData.get('employmentType') as string,
      workMode: formData.get('workMode') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string | null,
      salaryMin: formData.get('salaryMin') as string | null,
      salaryMax: formData.get('salaryMax') as string | null,
      hideSalary: formData.get('hideSalary') as string,
      numberOfOpenings: formData.get('numberOfOpenings') as string,
      applicationDeadline: formData.get('applicationDeadline') as string | null,
      category: formData.get('category') as string,
      status: formData.get('status') as string | null,
    };

    if (
      !data.title ||
      !data.description ||
      !data.requirements ||
      !data.skills ||
      !data.category
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    let skillsArray: string[] = [];
    try {
      skillsArray = JSON.parse(data.skills);
    } catch (error) {
      console.error('Error parsing skills:', error);
      return NextResponse.json(
        { error: 'Invalid skills format' },
        { status: 400 },
      );
    }

    let slug = existingJob.slug;
    if (data.title !== existingJob.title) {
      slug = await generateUniqueSlug(data.title);
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities || null,
        skills: skillsArray,
        experienceLevel: data.experienceLevel as ExperienceLevel,
        employmentType: data.employmentType as EmploymentType,
        workMode: data.workMode as WorkMode,
        country: data.country,
        city: data.city || null,
        salaryMin: data.salaryMin ? parseInt(data.salaryMin) : null,
        salaryMax: data.salaryMax ? parseInt(data.salaryMax) : null,
        hideSalary: data.hideSalary === 'true',
        numberOfOpenings: parseInt(data.numberOfOpenings),
        applicationDeadline: data.applicationDeadline
          ? new Date(data.applicationDeadline)
          : null,
        category: data.category,
        slug,
        ...(data.status && { status: data.status as JobStatus }),
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: 'Job updated successfully',
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 },
      );
    }

    const existingJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (existingJob.companyId !== company.id) {
      return NextResponse.json(
        { error: 'Unauthorized: This job does not belong to your company' },
        { status: 403 },
      );
    }

    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete job with ${existingJob._count.applications} application(s). Consider closing the job instead.`,
        },
        { status: 400 },
      );
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
