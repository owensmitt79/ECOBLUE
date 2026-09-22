import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getSupabase } from '@/lib/supabase';

const TABLE_MAP: Record<string, string> = {
  quotes: 'quotes',
  inquiries: 'inquiries',
  partnerships: 'partnerships',
  careers: 'careers',
  consultants: 'consultants',
};

/**
 * GET /api/admin/records?type=quotes|inquiries|partnerships|careers|consultants
 * Strictly requires valid admin session cookie.
 */
export async function GET(req: NextRequest) {
  const auth = isAdminAuthenticated(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrative session required.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'quotes';
  const table = TABLE_MAP[type];

  if (!table) {
    return NextResponse.json(
      { success: false, error: `Invalid record type: ${type}` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database service is not configured on server.' },
      { status: 503 }
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
    data: data ?? [],
  });
}

/**
 * PATCH /api/admin/records
 * Update record status (Pending, Reviewed, Contacted, Completed, etc.)
 * Strictly requires valid admin session cookie.
 */
export async function PATCH(req: NextRequest) {
  const auth = isAdminAuthenticated(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrative session required.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { type, id, status } = body;

    if (!type || !id || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: type, id, status' },
        { status: 400 }
      );
    }

    const table = TABLE_MAP[type];
    if (!table) {
      return NextResponse.json(
        { success: false, error: `Invalid record type: ${type}` },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Database service is not configured on server.' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from(table)
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Record ${id} updated to status ${status}`,
      record: data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to update record' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/records?type=quotes&id=QUO-123
 * Strictly requires valid admin session cookie.
 */
export async function DELETE(req: NextRequest) {
  const auth = isAdminAuthenticated(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Administrative session required.' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (!type || !id) {
    return NextResponse.json(
      { success: false, error: 'Missing type or id query parameter' },
      { status: 400 }
    );
  }

  const table = TABLE_MAP[type];
  if (!table) {
    return NextResponse.json(
      { success: false, error: `Invalid record type: ${type}` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: 'Database service is not configured on server.' },
      { status: 503 }
    );
  }

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Record ${id} deleted successfully.`,
  });
}
