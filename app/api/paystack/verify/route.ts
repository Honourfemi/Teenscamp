import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { assignPlatoon } from '@/lib/platoons';
import { generateRegistrationId } from '@/lib/registrationId';
import { sendConfirmationEmail } from '@/lib/email';
import QRCode from 'qrcode';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json({ error: 'Missing payment reference.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: participant, error: findError } = await supabase
      .from('participants')
      .select('*')
      .eq('payment_reference', reference)
      .single();

    if (findError || !participant) {
      return NextResponse.json(
        { error: 'Registration not found for this payment.' },
        { status: 404 }
      );
    }

    // Already processed (e.g. user refreshed the page) — return existing result,
    // don't re-assign a platoon or resend the email.
    if (participant.payment_status === 'success' && participant.registration_id) {
      return NextResponse.json({
        success: true,
        registrationId: participant.registration_id,
        platoon: participant.platoon,
        fullName: participant.full_name,
      });
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    const verifyData = await verifyRes.json();

    if (verifyData.data?.status !== 'success') {
      await supabase
        .from('participants')
        .update({ payment_status: 'failed' })
        .eq('id', participant.id);
      return NextResponse.json(
        { success: false, error: 'Payment was not successful.' },
        { status: 400 }
      );
    }

    const platoon = await assignPlatoon(supabase);
    const registrationId = await generateRegistrationId(supabase);
    const qrDataUrl = await QRCode.toDataURL(registrationId);

    await supabase
      .from('participants')
      .update({
        payment_status: 'success',
        registration_id: registrationId,
        platoon,
        amount: verifyData.data.amount / 100,
      })
      .eq('id', participant.id);

    try {
      await sendConfirmationEmail({
        to: participant.email,
        name: participant.full_name,
        registrationId,
        platoon,
        qrDataUrl,
      });
    } catch (emailErr) {
      console.error('Email failed to send:', emailErr);
      // Payment already succeeded — don't fail the whole request over email.
    }

    return NextResponse.json({
      success: true,
      registrationId,
      platoon,
      fullName: participant.full_name,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong verifying payment.' },
      { status: 500 }
    );
  }
}
