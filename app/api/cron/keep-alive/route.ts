import { supabaseServer } from '@/src/lib/supabaseServer';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('user-agent');

    const isLocalTest = process.env.NODE_ENV === 'development';
    const isVercelCron = authHeader?.includes('vercel-cron');

    if (!isVercelCron && !isLocalTest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseServer.storage
      .from('company-logos')
      .list('', { limit: 1 });

    if (error) {
      console.error('❌ Supabase ping failed:', error);
      return NextResponse.json(
        {
          error: 'Supabase ping failed',
          details: error.message,
        },
        { status: 500 },
      );
    }

    console.log('✅ Supabase storage pinged at:', new Date().toISOString());

    return NextResponse.json({
      success: true,
      message: 'Supabase storage pinged successfully',
      timestamp: new Date().toISOString(),
      source: isVercelCron ? 'vercel-cron' : 'local-test',
      filesFound: data?.length || 0,
    });
  } catch (error) {
    console.error('❌ Keep-alive cron failed:', error);
    return NextResponse.json(
      {
        error: 'Cron execution failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
