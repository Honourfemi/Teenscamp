import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { CAMP_CONFIG } from '@/lib/campConfig';

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('participants').select('payment_status, platoon');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const totalRegistrations = data.length;
  const totalPaid = data.filter((p: any) => p.payment_status === 'success').length;

  const perPlatoon: Record<string, number> = {};
  CAMP_CONFIG.platoons.forEach((p) => (perPlatoon[p] = 0));
  data.forEach((p: any) => {
    if (p.platoon && perPlatoon[p.platoon] !== undefined) perPlatoon[p.platoon]++;
  });

  return NextResponse.json({ totalRegistrations, totalPaid, perPlatoon });
}
