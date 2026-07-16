import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function csvEscape(value: any) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = [
    'registration_id',
    'full_name',
    'gender',
    'date_of_birth',
    'phone_number',
    'email',
    'home_address',
    'guardian_name',
    'guardian_phone',
    'emergency_contact',
    'church_or_school',
    'platoon',
    'payment_status',
    'amount',
    'checked_in',
    'created_at',
  ];

  const rows = (data || []).map((p: any) => headers.map((h) => csvEscape(p[h])).join(','));
  const csv = [headers.join(','), ...rows].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="registrations.csv"',
    },
  });
}
