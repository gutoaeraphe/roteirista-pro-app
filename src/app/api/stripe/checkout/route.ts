
// This API route is deprecated and no longer in use.
// The payment logic has been migrated to use Stripe Payment Links directly on the client-side.
// This file is kept for historical reference but can be safely removed.
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({ error: 'This endpoint is deprecated.' }, { status: 410 });
}
