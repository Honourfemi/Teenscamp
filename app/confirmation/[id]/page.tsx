import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CAMP_CONFIG } from '@/lib/campConfig';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import QRCode from 'qrcode';

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseAdmin();
  const { data: participant } = await supabase
    .from('participants')
    .select('*')
    .eq('registration_id', params.id)
    .single();

  if (!participant || participant.payment_status !== 'success') {
    return (
      <main>
        <Navbar />
        <section className="pt-32 pb-20 px-6 max-w-lg mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-red-600 mb-4">Registration Not Found</h1>
          <p className="text-gray-700">
            We couldn't find a confirmed registration with that ID. If you just paid, please
            check the email we sent you.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  const qrDataUrl = await QRCode.toDataURL(participant.registration_id);

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 px-6 max-w-lg mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-camp-purple mb-2">
          🎉 You're Registered!
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to {CAMP_CONFIG.name}, {participant.full_name}!
        </p>

        <div className="bg-white shadow rounded-2xl p-8 mb-6">
          <img src={qrDataUrl} alt="Your QR Code" className="mx-auto mb-4 w-48 h-48" />
          <p className="text-sm text-gray-500 mb-1">Registration ID</p>
          <p className="text-2xl font-extrabold text-camp-purple mb-4">
            {participant.registration_id}
          </p>
          <p className="text-sm text-gray-500 mb-1">Your Platoon</p>
          <p className="text-2xl font-extrabold" style={{ color: '#FF6B35' }}>
            {participant.platoon}
          </p>
        </div>

        <p className="text-gray-600 mb-2">
          A confirmation email with this QR code has been sent to{' '}
          <strong>{participant.email}</strong>.
        </p>
        <p className="text-gray-600">
          Please bring your QR code (printed or on your phone) on{' '}
          <strong>{CAMP_CONFIG.dateDisplay}</strong> for check-in.
        </p>
      </section>
      <Footer />
    </main>
  );
}
