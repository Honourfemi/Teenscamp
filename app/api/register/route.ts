import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      homeAddress,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      guardianName,
      guardianPhone,
      emergencyContact,
      churchOrSchool,
    } = body;

    if (
      !fullName ||
      !homeAddress ||
      !phoneNumber ||
      !email ||
      !gender ||
      !dateOfBirth ||
      !guardianName ||
      !guardianPhone
    ) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('participants')
      .insert({
        full_name: fullName,
        home_address: homeAddress,
        phone_number: phoneNumber,
        email,
        gender,
        date_of_birth: dateOfBirth,
        guardian_name: guardianName,
        guardian_phone: guardianPhone,
        emergency_contact: emergencyContact || null,
        church_or_school: churchOrSchool || null,
        payment_status: 'pending',
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ participantId: data.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
