import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const TABLE_MAP: Record<string, string> = {
  quotes: 'quotes',
  inquiries: 'inquiries',
  partnerships: 'partnerships',
  careers: 'careers',
  consultants: 'consultants'
};

export async function GET(request: NextRequest) {
  // Securing customer leads: require admin authentication
  const auth = isAdminAuthenticated(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrative session required to view leads.' },
      { status: 401 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Supabase is not configured on server. Please set SUPABASE_URL and SUPABASE_ANON_KEY in environment variables.'
    }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'quotes';
  const table = TABLE_MAP[type];

  if (!table) {
    return NextResponse.json(
      { success: false, error: `Unknown type: ${type}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    type,
    count: data?.length ?? 0,
    data: data ?? []
  });
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Database is not configured on server.'
      }, { status: 503 });
    }
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing type or data in request body' },
        { status: 400 }
      );
    }

    const table = TABLE_MAP[type];
    if (!table) {
      return NextResponse.json(
        { success: false, error: `Unknown type: ${type}` },
        { status: 400 }
      );
    }

    const newRecord = {
      id: `${type.slice(0, 3).toUpperCase()}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...data
    };

    const { data: inserted, error } = await supabase
      .from(table)
      .insert(newRecord)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead received and saved to database successfully',
        record: inserted
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
