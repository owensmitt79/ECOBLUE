import { NextResponse } from 'next/server';

// Server-side fallback in-memory cache for API consumers
const inMemoryLeads: Record<string, any[]> = {
  quotes: [],
  inquiries: [],
  partnerships: [],
  careers: [],
  consultants: []
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'quotes';

  const items = inMemoryLeads[type] || [];
  return NextResponse.json({
    success: true,
    type,
    count: items.length,
    data: items
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

    const newRecord = {
      id: `${type.slice(0, 3).toUpperCase()}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...data
    };

    if (!inMemoryLeads[type]) {
      inMemoryLeads[type] = [];
    }
    inMemoryLeads[type].unshift(newRecord);

    return NextResponse.json(
      {
        success: true,
        message: 'Lead received and logged successfully',
        record: newRecord
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
