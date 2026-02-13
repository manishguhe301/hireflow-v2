import { apiAuthGuard } from '@/src/lib/apiAuthGuard';
import {
  deleteFileFromSupabase,
  uploadFileToSupabase,
} from '@/src/lib/fileUpload';
import prisma from '@/src/lib/prisma';
import {
  CurrentEmployment,
  ExperienceLevel,
  Role,
  WorkMode,
} from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

function calculateProfileCompletion(data: {
  name: string;
  contactEmail: string;
  phone: string;
  country: string;
  city: string | null;
  avatar: string | null;
  resumeUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferredWorkMode: any[];
  willingToRelocate: boolean;
  professionalTitle: string | null;
  bio: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yearsOfExperience: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentEmployment: any;
  skills: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workExperience: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  education: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certifications: any[];
  portfolioWebsite: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  otherLinks: string[];
  jobCategories: string[];
  preferredLocations: string[];
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  noticePeriod: string | null;
}): number {
  let score = 0;
  const weights = {
    name: 5,
    contactEmail: 5,
    phone: 5,
    country: 5,
    resumeUrl: 10,

    preferredWorkMode: 5,
    skills: 10,
    workExperience: 15,
    jobCategories: 5,
    preferredLocations: 5,

    city: 2,
    avatar: 3,
    willingToRelocate: 2,
    professionalTitle: 3,
    bio: 5,
    yearsOfExperience: 3,
    currentEmployment: 2,
    education: 5,
    certifications: 3,
    portfolioWebsite: 2,
  };

  if (data.name) score += weights.name;
  if (data.contactEmail) score += weights.contactEmail;
  if (data.phone) score += weights.phone;
  if (data.country) score += weights.country;
  if (data.resumeUrl) score += weights.resumeUrl;

  if (data.preferredWorkMode.length > 0) score += weights.preferredWorkMode;
  if (data.skills.length > 0) score += weights.skills;
  if (data.workExperience.length > 0) score += weights.workExperience;
  if (data.jobCategories.length > 0) score += weights.jobCategories;
  if (data.preferredLocations.length > 0) score += weights.preferredLocations;

  if (data.city) score += weights.city;
  if (data.avatar) score += weights.avatar;
  if (data.willingToRelocate !== undefined) score += weights.willingToRelocate;
  if (data.professionalTitle) score += weights.professionalTitle;
  if (data.bio) score += weights.bio;
  if (data.yearsOfExperience) score += weights.yearsOfExperience;
  if (data.currentEmployment) score += weights.currentEmployment;
  if (data.education.length > 0) score += weights.education;
  if (data.certifications.length > 0) score += weights.certifications;
  if (data.portfolioWebsite) score += weights.portfolioWebsite;

  return Math.min(score, 100);
}

export async function POST(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) {
      return guard.response;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: guard.session.user.id,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists. Use PATCH to update.' },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const avatar = formData.get('avatar') as File | null;
    const resume = formData.get('resume') as File | null;

    const data = {
      name: formData.get('name') as string,
      contactEmail: formData.get('contactEmail') as string,
      countryPhoneCode: formData.get('countryPhoneCode') as string,
      phone: formData.get('phone') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string,

      preferredWorkMode: formData.get('preferredWorkMode') as string,
      willingToRelocate: formData.get('willingToRelocate') as string,
      professionalTitle: formData.get('professionalTitle') as string,
      bio: formData.get('bio') as string,
      yearsOfExperience: formData.get('yearsOfExperience') as string,
      currentEmployment: formData.get('currentEmployment') as string,

      workExperience: formData.get('workExperience') as string,

      education: formData.get('education') as string,

      skills: formData.get('skills') as string,

      certifications: formData.get('certifications') as string,

      portfolioWebsite: formData.get('portfolioWebsite') as string,
      githubUrl: formData.get('githubUrl') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      twitterUrl: formData.get('twitterUrl') as string,
      otherLinks: formData.get('otherLinks') as string,
      jobCategories: formData.get('jobCategories') as string,
      preferredLocations: formData.get('preferredLocations') as string,
      expectedSalaryMin: formData.get('expectedSalaryMin') as string,
      expectedSalaryMax: formData.get('expectedSalaryMax') as string,
      noticePeriod: formData.get('noticePeriod') as string,
    };

    if (
      !data.name ||
      !data.contactEmail ||
      !data.phone ||
      !data.country ||
      !data.countryPhoneCode
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume is required' },
        { status: 400 },
      );
    }

    let preferredWorkModeArray: WorkMode[] = [];
    if (data.preferredWorkMode) {
      try {
        preferredWorkModeArray = JSON.parse(data.preferredWorkMode);
      } catch (error) {
        console.error('Error parsing preferredWorkMode:', error);
        return NextResponse.json(
          { error: 'Invalid preferredWorkMode format' },
          { status: 400 },
        );
      }
    }

    let skillsArray: string[] = [];
    if (data.skills) {
      try {
        skillsArray = JSON.parse(data.skills);
      } catch (error) {
        console.error('Error parsing skills:', error);
        return NextResponse.json(
          { error: 'Invalid skills format' },
          { status: 400 },
        );
      }
    }

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let workExperienceArray: any[] = [];
    if (data.workExperience) {
      try {
        workExperienceArray = JSON.parse(data.workExperience);
      } catch (error) {
        console.error('Error parsing workExperience:', error);
        return NextResponse.json(
          { error: 'Invalid workExperience format' },
          { status: 400 },
        );
      }
    }

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let educationArray: any[] = [];
    if (data.education) {
      try {
        educationArray = JSON.parse(data.education);
      } catch (error) {
        console.error('Error parsing education:', error);
        return NextResponse.json(
          { error: 'Invalid education format' },
          { status: 400 },
        );
      }
    }

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let certificationsArray: any[] = [];
    if (data.certifications) {
      try {
        certificationsArray = JSON.parse(data.certifications);
      } catch (error) {
        console.error('Error parsing certifications:', error);
        return NextResponse.json(
          { error: 'Invalid certifications format' },
          { status: 400 },
        );
      }
    }

    let jobCategoriesArray: string[] = [];
    if (data.jobCategories) {
      try {
        jobCategoriesArray = JSON.parse(data.jobCategories);
      } catch (error) {
        console.error('Error parsing jobCategories:', error);
        return NextResponse.json(
          { error: 'Invalid jobCategories format' },
          { status: 400 },
        );
      }
    }

    let preferredLocationsArray: string[] = [];
    if (data.preferredLocations) {
      try {
        preferredLocationsArray = JSON.parse(data.preferredLocations);
      } catch (error) {
        console.error('Error parsing preferredLocations:', error);
        return NextResponse.json(
          { error: 'Invalid preferredLocations format' },
          { status: 400 },
        );
      }
    }

    let otherLinksArray: string[] = [];
    if (data.otherLinks) {
      try {
        otherLinksArray = JSON.parse(data.otherLinks);
      } catch (error) {
        console.error('Error parsing otherLinks:', error);
        return NextResponse.json(
          { error: 'Invalid otherLinks format' },
          { status: 400 },
        );
      }
    }

    const resumeResult = await uploadFileToSupabase(resume, 'user-resumes');
    const avatarResult = avatar
      ? await uploadFileToSupabase(avatar, 'user-avatars')
      : null;

    // Create profile with nested creates
    const profile = await prisma.profile.create({
      data: {
        userId: guard.session.user.id,
        name: data.name,
        contactEmail: data.contactEmail,
        countryPhoneCode: data.countryPhoneCode,
        phone: data.phone,
        country: data.country,
        city: data.city || null,

        avatar: avatarResult?.url || null,
        avatarPath: avatarResult?.path || null,
        resumeUrl: resumeResult.url,
        resumePath: resumeResult.path,

        preferredWorkMode: preferredWorkModeArray,
        willingToRelocate: data.willingToRelocate === 'true',
        professionalTitle: data.professionalTitle || null,
        bio: data.bio || null,
        yearsOfExperience: (data.yearsOfExperience as ExperienceLevel) || null,
        currentEmployment:
          (data.currentEmployment as CurrentEmployment) || null,

        skills: skillsArray,

        portfolioWebsite: data.portfolioWebsite || null,
        githubUrl: data.githubUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        otherLinks: otherLinksArray,

        jobCategories: jobCategoriesArray,
        preferredLocations: preferredLocationsArray,
        expectedSalaryMin: data.expectedSalaryMin
          ? parseInt(data.expectedSalaryMin)
          : null,
        expectedSalaryMax: data.expectedSalaryMax
          ? parseInt(data.expectedSalaryMax)
          : null,
        noticePeriod: data.noticePeriod || null,

        workExperience: {
          create: workExperienceArray.map((exp) => ({
            company: exp.company,
            title: exp.title,
            location: exp.location || null,
            workMode: exp.workMode,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description || null,
            isCurrent: exp.isCurrent,
          })),
        },

        education: {
          create: educationArray.map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy || null,
            startYear: edu.startYear,
            endYear: edu.endYear || null,
            grade: edu.grade || null,
            isCurrent: edu.isCurrent,
          })),
        },

        certifications: {
          create: certificationsArray.map((cert) => ({
            name: cert.name,
            organization: cert.organization,
            issueDate: new Date(cert.issueDate),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            credentialUrl: cert.credentialUrl || null,
            credentialId: cert.credentialId || null,
          })),
        },

        profileCompleted: calculateProfileCompletion({
          name: data.name,
          contactEmail: data.contactEmail,
          phone: data.phone,
          country: data.country,
          city: data.city || null,
          avatar: avatarResult?.url || null,
          resumeUrl: resumeResult.url,
          preferredWorkMode: preferredWorkModeArray,
          willingToRelocate: data.willingToRelocate === 'true',
          professionalTitle: data.professionalTitle || null,
          bio: data.bio || null,
          yearsOfExperience:
            (data.yearsOfExperience as ExperienceLevel) || null,
          currentEmployment:
            (data.currentEmployment as CurrentEmployment) || null,
          skills: skillsArray,
          workExperience: workExperienceArray,
          education: educationArray,
          certifications: certificationsArray,
          portfolioWebsite: data.portfolioWebsite || null,
          githubUrl: data.githubUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          twitterUrl: data.twitterUrl || null,
          otherLinks: otherLinksArray,
          jobCategories: jobCategoriesArray,
          preferredLocations: preferredLocationsArray,
          expectedSalaryMin: data.expectedSalaryMin
            ? parseInt(data.expectedSalaryMin)
            : null,
          expectedSalaryMax: data.expectedSalaryMax
            ? parseInt(data.expectedSalaryMax)
            : null,
          noticePeriod: data.noticePeriod || null,
        }),
        isPublic: true,
      },
      include: {
        workExperience: true,
        education: true,
        certifications: true,
      },
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await apiAuthGuard([Role.JOB_SEEKER]);
    if (!guard.ok) {
      return guard.response;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: {
        userId: guard.session.user.id,
      },
    });

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Profile not found. Create one first.' },
        { status: 404 },
      );
    }

    const formData = await req.formData();

    const avatar = formData.get('avatar') as File | null;
    const resume = formData.get('resume') as File | null;

    const data = {
      name: formData.get('name') as string,
      contactEmail: formData.get('contactEmail') as string,
      countryPhoneCode: formData.get('countryPhoneCode') as string,
      phone: formData.get('phone') as string,
      country: formData.get('country') as string,
      city: formData.get('city') as string,

      preferredWorkMode: formData.get('preferredWorkMode') as string,
      willingToRelocate: formData.get('willingToRelocate') as string,
      professionalTitle: formData.get('professionalTitle') as string,
      bio: formData.get('bio') as string,
      yearsOfExperience: formData.get('yearsOfExperience') as string,
      currentEmployment: formData.get('currentEmployment') as string,

      workExperience: formData.get('workExperience') as string,
      education: formData.get('education') as string,
      skills: formData.get('skills') as string,
      certifications: formData.get('certifications') as string,

      portfolioWebsite: formData.get('portfolioWebsite') as string,
      githubUrl: formData.get('githubUrl') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      twitterUrl: formData.get('twitterUrl') as string,
      otherLinks: formData.get('otherLinks') as string,
      jobCategories: formData.get('jobCategories') as string,
      preferredLocations: formData.get('preferredLocations') as string,
      expectedSalaryMin: formData.get('expectedSalaryMin') as string,
      expectedSalaryMax: formData.get('expectedSalaryMax') as string,
      noticePeriod: formData.get('noticePeriod') as string,
    };

    if (
      !data.name ||
      !data.contactEmail ||
      !data.phone ||
      !data.country ||
      !data.countryPhoneCode
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const preferredWorkModeArray = data.preferredWorkMode
      ? JSON.parse(data.preferredWorkMode)
      : existingProfile.preferredWorkMode;

    const skillsArray = data.skills
      ? JSON.parse(data.skills)
      : existingProfile.skills;

    const workExperienceArray = data.workExperience
      ? JSON.parse(data.workExperience)
      : [];

    const educationArray = data.education ? JSON.parse(data.education) : [];

    const certificationsArray = data.certifications
      ? JSON.parse(data.certifications)
      : [];

    const jobCategoriesArray = data.jobCategories
      ? JSON.parse(data.jobCategories)
      : existingProfile.jobCategories;

    const preferredLocationsArray = data.preferredLocations
      ? JSON.parse(data.preferredLocations)
      : existingProfile.preferredLocations;

    const otherLinksArray = data.otherLinks
      ? JSON.parse(data.otherLinks)
      : existingProfile.otherLinks;

    let avatarUrl = existingProfile.avatar;
    let avatarPath = existingProfile.avatarPath;
    let resumeUrl = existingProfile.resumeUrl;
    let resumePath = existingProfile.resumePath;

    if (avatar) {
      if (existingProfile.avatarPath) {
        await deleteFileFromSupabase(
          existingProfile.avatarPath,
          'user-avatars',
        );
      }
      const avatarResult = await uploadFileToSupabase(avatar, 'user-avatars');
      avatarUrl = avatarResult.url;
      avatarPath = avatarResult.path;
    }

    if (resume) {
      if (existingProfile.resumePath) {
        await deleteFileFromSupabase(
          existingProfile.resumePath,
          'user-resumes',
        );
      }
      const resumeResult = await uploadFileToSupabase(resume, 'user-resumes');
      resumeUrl = resumeResult.url;
      resumePath = resumeResult.path;
    }

    await prisma.workExperience.deleteMany({
      where: { profileId: existingProfile.id },
    });

    await prisma.education.deleteMany({
      where: { profileId: existingProfile.id },
    });

    await prisma.certification.deleteMany({
      where: { profileId: existingProfile.id },
    });

    const updatedProfile = await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        name: data.name,
        contactEmail: data.contactEmail,
        countryPhoneCode: data.countryPhoneCode,
        phone: data.phone,
        country: data.country,
        city: data.city || null,

        avatar: avatarUrl,
        avatarPath,
        resumeUrl,
        resumePath,

        preferredWorkMode: preferredWorkModeArray,
        willingToRelocate: data.willingToRelocate === 'true',
        professionalTitle: data.professionalTitle || null,
        bio: data.bio || null,
        yearsOfExperience: (data.yearsOfExperience as ExperienceLevel) || null,
        currentEmployment:
          (data.currentEmployment as CurrentEmployment) || null,

        skills: skillsArray,

        portfolioWebsite: data.portfolioWebsite || null,
        githubUrl: data.githubUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        otherLinks: otherLinksArray,

        jobCategories: jobCategoriesArray,
        preferredLocations: preferredLocationsArray,
        expectedSalaryMin: data.expectedSalaryMin
          ? parseInt(data.expectedSalaryMin)
          : null,
        expectedSalaryMax: data.expectedSalaryMax
          ? parseInt(data.expectedSalaryMax)
          : null,
        noticePeriod: data.noticePeriod || null,
        profileCompleted: calculateProfileCompletion({
          name: data.name,
          contactEmail: data.contactEmail,
          phone: data.phone,
          country: data.country,
          city: data.city || null,
          avatar: avatarUrl,
          resumeUrl,
          preferredWorkMode: preferredWorkModeArray,
          willingToRelocate: data.willingToRelocate === 'true',
          professionalTitle: data.professionalTitle || null,
          bio: data.bio || null,
          yearsOfExperience:
            (data.yearsOfExperience as ExperienceLevel) || null,
          currentEmployment:
            (data.currentEmployment as CurrentEmployment) || null,
          skills: skillsArray,
          workExperience: workExperienceArray,
          education: educationArray,
          certifications: certificationsArray,
          portfolioWebsite: data.portfolioWebsite || null,
          githubUrl: data.githubUrl || null,
          linkedinUrl: data.linkedinUrl || null,
          twitterUrl: data.twitterUrl || null,
          otherLinks: otherLinksArray,
          jobCategories: jobCategoriesArray,
          preferredLocations: preferredLocationsArray,
          expectedSalaryMin: data.expectedSalaryMin
            ? parseInt(data.expectedSalaryMin)
            : null,
          expectedSalaryMax: data.expectedSalaryMax
            ? parseInt(data.expectedSalaryMax)
            : null,
          noticePeriod: data.noticePeriod || null,
        }),

        workExperience: {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: workExperienceArray.map((exp: any) => ({
            company: exp.company,
            title: exp.title,
            location: exp.location || null,
            workMode: exp.workMode,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description || null,
            isCurrent: exp.isCurrent,
          })),
        },

        education: {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: educationArray.map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy || null,
            startYear: edu.startYear,
            endYear: edu.endYear || null,
            grade: edu.grade || null,
            isCurrent: edu.isCurrent,
          })),
        },

        certifications: {
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: certificationsArray.map((cert: any) => ({
            name: cert.name,
            organization: cert.organization,
            issueDate: new Date(cert.issueDate),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            credentialUrl: cert.credentialUrl || null,
            credentialId: cert.credentialId || null,
          })),
        },
      },
      include: {
        workExperience: true,
        education: true,
        certifications: true,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
