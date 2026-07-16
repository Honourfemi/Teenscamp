import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const platoon = searchParams.get('platoon') || '';
  const paymentStatus = searchParams.get('paymentStatus') || '';
  const gender = searchParams.get('gender') || '';

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  if (platoon) query = query.eq('platoon', platoon);
  if (paymentStatus) query = query.eq('payment_status', paymentStatus);
  if (gender) query = query.eq('gender', gender);
  if (search) {
    const s = search.replace(/,/g, ' ');
    query = query.or(
      `full_name.ilike.%${s}%,phone_number.ilike.%${s}%,email.ilike.%${s}%,registration_id.ilike.%${s}%`
    );
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ participants: data });
}
