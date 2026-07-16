import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { CAMP_CONFIG } from '@/lib/campConfig';

export async function POST(request: Request) {
  try {
    const { participantId } = await request.json();
    const supabase = getSupabaseAdmin();

    const { data: participant, error } = await supabase
      .from('participants')
      .select('id, email, full_name')
      .eq('id', participantId)
      .single();

    if (error || !participant) {
      return NextResponse.json({ error: 'Registration not found.' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: participant.email,
        amount: CAMP_CONFIG.feeNaira * 100, // Paystack expects kobo
        callback_url: `${siteUrl}/payment/callback`,
        metadata: { participantId: participant.id },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      console.error('Paystack init failed:', paystackData);
      return NextResponse.json(
        { error: 'Could not start payment. Please try again.' },
        { status: 500 }
      );
    }

    await supabase
      .from('participants')
      .update({ payment_reference: paystackData.data.reference })
      .eq('id', participant.id);

    return NextResponse.json({ authorizationUrl: paystackData.data.authorization_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong starting payment.' },
      { status: 500 }
    );
  }
}
