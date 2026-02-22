import { notifyRoleUser } from '@/src/lib/notificationService';
import prisma from '@/src/lib/prisma';
import { isPasswordValid, isValidEmail } from '@/src/utils/helper';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: `Missing fields` }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      );
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 },
      );
    }

    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const isAlreadyEmailRegistered = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isAlreadyEmailRegistered) {
      return NextResponse.json(
        {
          error: 'Email already registered',
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Failed to create user',
        },
        {
          status: 400,
        },
      );
    }

    const isCompanyAdmin: boolean = user.role === Role.COMPANY_ADMIN;

    await notifyRoleUser({
      role: Role.PLATFORM_ADMIN,
      type: isCompanyAdmin ? 'NEW_COMPANY_REGISTERED' : 'NEW_USER_REGISTERED',
      title: isCompanyAdmin ? 'New Company Registered' : 'New User Registered',
      message: `${user.name} (${user.role}) just signed up.`,
      link: `/admin/users`,
      metadata: {
        userId: user.id,
        userRole: user.role,
        userEmail: user.email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
