import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const full = req.nextUrl.searchParams.get('full') === 'true';

    const company = await prisma.company.findUnique({
      where: { id, status: 'APPROVED' },
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        industry: true,
        companySize: true,
        foundedYear: true,
        country: true,
        city: true,
        website: true,
        linkedinProfile: true,
        ...(full && {
          contactEmail: true,
          contactPhone: true,
          address: true,
        }),
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found or not available' },
        { status: 404 },
      );
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: id, status: 'ACTIVE' },
      select: {
        id: true,
        title: true,
        slug: true,
        country: true,
        city: true,
        workMode: true,
        employmentType: true,
        experienceLevel: true,
        salaryMin: true,
        salaryMax: true,
        hideSalary: true,
        createdAt: true,
        ...(full && {
          description: true,
          skills: true,
          applicationDeadline: true,
          numberOfOpenings: true,
        }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ company, jobs });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
