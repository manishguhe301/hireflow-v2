import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
export async function DELETE(req: NextRequest) {
  try {
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 },
    );
  }
}
