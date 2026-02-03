import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import {
  deleteFileFromSupabase,
  uploadFileToSupabase,
} from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import { CompanyStatus, Role } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const company = await prisma.company.findUnique({
      where: {
        userId: guard.session.user.id,
      },
    });

    return NextResponse.json({
      company: company || null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.COMPANY_ADMIN]);
    if (!guard.ok) {
      return guard.response;
    }

    const existingCompany = await prisma.company.findUnique({
      where: {
        userId: guard.session.user.id,
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company profile already exists' },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const logo = formData.get('logo') as File | null;
    const businessDocument = formData.get('businessDocument') as File | null;
    const taxDocument = formData.get('taxDocument') as File | null;

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      industry: formData.get('industry') as string,
      companySize: formData.get('companySize') as string,
      foundedYear: formData.get('foundedYear') as string,
      website: formData.get('website') as string,
      linkedinProfile: formData.get('linkedinProfile') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      address: formData.get('address') as string,
      country: formData.get('country') as string,
      countryPhoneCode: formData.get('countryPhoneCode') as string,
    };

    if (
      !data.name ||
      !data.description ||
      !data.industry ||
      !data.companySize
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!logo || !businessDocument) {
      return NextResponse.json(
        { error: 'Logo and business document are required' },
        { status: 400 },
      );
    }

    const logoResult = await uploadFileToSupabase(logo, 'company-logos');
    const businessDocResult = await uploadFileToSupabase(
      businessDocument,
      'company-documents',
    );
    const taxDocResult = taxDocument
      ? await uploadFileToSupabase(taxDocument, 'company-documents')
      : null;

    const company = await prisma.company.create({
      data: {
        userId: guard.session.user.id,
        name: data.name,
        description: data.description,
        industry: data.industry,
        companySize: data.companySize,
        foundedYear: parseInt(data.foundedYear),
        website: data.website,
        linkedinProfile: data.linkedinProfile || null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        country: data.country,
        countryPhoneCode: data.countryPhoneCode,
        address: data.address || null,

        logo: logoResult.url,
        logoPath: logoResult.path,

        businessDocument: businessDocResult.url,
        businessDocPath: businessDocResult.path,

        taxDocument: taxDocResult?.url || null,
        taxDocPath: taxDocResult?.path || null,

        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, company }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
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

    const existingCompany = await prisma.company.findUnique({
      where: { userId: guard.session.user.id },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company profile not found' },
        { status: 404 },
      );
    }

    if (
      existingCompany.status !== 'REJECTED' &&
      existingCompany.status !== 'APPROVED'
    ) {
      return NextResponse.json(
        { error: 'Profile cannot be updated in current state' },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      industry: formData.get('industry') as string,
      companySize: formData.get('companySize') as string,
      foundedYear: formData.get('foundedYear') as string,
      website: formData.get('website') as string,
      linkedinProfile: formData.get('linkedinProfile') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      location: formData.get('location') as string,
      address: formData.get('address') as string,
      country: formData.get('country') as string,
      countryPhoneCode: formData.get('countryPhoneCode') as string,
    };

    if (
      !data.name ||
      !data.description ||
      !data.industry ||
      !data.companySize
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const logo = formData.get('logo') as File | null;
    const businessDocument = formData.get('businessDocument') as File | null;
    const taxDocument = formData.get('taxDocument') as File | null;

    let logoUrl = existingCompany.logo;
    let logoPath = existingCompany.logoPath;
    let businessDocUrl = existingCompany.businessDocument;
    let businessDocPath = existingCompany.businessDocPath;
    let taxDocUrl = existingCompany.taxDocument;
    let taxDocPath = existingCompany.taxDocPath;

    if (logo) {
      if (existingCompany.logoPath) {
        await deleteFileFromSupabase(existingCompany.logoPath, 'company-logos');
      }
      const logoResult = await uploadFileToSupabase(logo, 'company-logos');
      logoUrl = logoResult.url;
      logoPath = logoResult.path;
    }

    if (businessDocument) {
      if (existingCompany.businessDocPath) {
        await deleteFileFromSupabase(
          existingCompany.businessDocPath,
          'company-documents',
        );
      }
      const docResult = await uploadFileToSupabase(
        businessDocument,
        'company-documents',
      );
      businessDocUrl = docResult.url;
      businessDocPath = docResult.path;
    }

    if (taxDocument) {
      if (existingCompany.taxDocPath) {
        await deleteFileFromSupabase(
          existingCompany.taxDocPath,
          'company-documents',
        );
      }
      const taxResult = await uploadFileToSupabase(
        taxDocument,
        'company-documents',
      );
      taxDocUrl = taxResult.url;
      taxDocPath = taxResult.path;
    }

    let newStatus: CompanyStatus = existingCompany.status;

    if (existingCompany.status === 'REJECTED') {
      newStatus = 'PENDING';
    }

    const updatedCompany = await prisma.company.update({
      where: { id: existingCompany.id },
      data: {
        name: data.name,
        description: data.description,
        industry: data.industry,
        companySize: data.companySize,
        foundedYear: parseInt(data.foundedYear),
        website: data.website,
        linkedinProfile: data.linkedinProfile || null,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone || null,
        country: data.country,
        address: data.address || null,
        logo: logoUrl,
        logoPath: logoPath,
        businessDocument: businessDocUrl,
        businessDocPath: businessDocPath,
        taxDocument: taxDocUrl,
        taxDocPath: taxDocPath,
        status: newStatus,
        rejectionReason:
          existingCompany.status === 'REJECTED'
            ? null
            : existingCompany.rejectionReason,
      },
    });

    return NextResponse.json({ success: true, company: updatedCompany });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
