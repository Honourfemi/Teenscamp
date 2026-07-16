import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

// Look up a participant by Registration ID (from a scanned QR code) without
// changing their check-in status yet.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get('registrationId');

  if (!registrationId) {
    return NextResponse.json({ error: 'Missing registration ID.' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: participant, error } = await supabase
    .from('participants')
    .select('*')
    .eq('registration_id', registrationId.trim())
    .single();

  if (error || !participant) {
    return NextResponse.json({ error: 'No registration found for that QR code.' }, { status: 404 });
  }

  return NextResponse.json({ participant });
}

// Actually mark the participant as checked in (called after admin confirms).
export async function POST(request: Request) {
  const { registrationId } = await request.json();

  const supabase = getSupabaseAdmin();
  const { data: participant, error } = await supabase
    .from('participants')
    .select('*')
    .eq('registration_id', registrationId)
    .single();

  if (error || !participant) {
    return NextResponse.json({ error: 'No registration found for that QR code.' }, { status: 404 });
  }

  if (participant.payment_status !== 'success') {
    return NextResponse.json(
      { participant, error: 'Payment not confirmed for this participant.' },
      { status: 400 }
    );
  }

  if (participant.checked_in) {
    return NextResponse.json({ participant, alreadyCheckedIn: true });
  }

  const { data: updated, error: updateError } = await supabase
    .from('participants')
    .update({ checked_in: true, checked_in_at: new Date().toISOString() })
    .eq('id', participant.id)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ participant: updated, alreadyCheckedIn: false });
}
