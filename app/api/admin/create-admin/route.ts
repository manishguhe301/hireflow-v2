import { authOptions } from '@/src/lib/auth';
import prisma from '@/src/lib/prisma';
import { isPasswordValid, isValidEmail } from '@/src/utils/helper';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== Role.PLATFORM_ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    if (role !== Role.PLATFORM_ADMIN) {
      return NextResponse.json(
        { error: 'User role is inappropriate for this operation' },
        { status: 400 },
      );
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
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: 'Admin created successfully',
        // admin,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
