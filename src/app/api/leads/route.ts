import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses env vars — safe on server only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TABLE_MAP: Record<string, string> = {
  quotes: 'quotes',
  inquiries: 'inquiries',
  partnerships: 'partnerships',
  careers: 'careers',
  consultants: 'consultants'
};

export async function GET(request: Request) {
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
