import { NextRequest, NextResponse } from 'next/server';

interface BookingPayload {
  name:     string;
  contact:  string;
  carrying: string[];
}

/**
 * Booking API stub.
 * Validates the payload shape and returns 200.
 * Wire up your email/CRM/calendar provider here when ready.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, contact, carrying } = body as Partial<BookingPayload>;

  if (!name?.trim() || !contact?.trim()) {
    return NextResponse.json({ error: 'name and contact are required' }, { status: 422 });
  }

  // TODO: forward to email provider (Resend, SendGrid, etc.) or CRM
  console.log('[booking]', { name, contact, carrying });

  return NextResponse.json({ ok: true }, { status: 200 });
}
