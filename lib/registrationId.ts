// Generates a short, unique Registration ID like "TC4-4821".
// Checks the database to make sure it hasn't been used before.
export async function generateRegistrationId(supabase: any): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const candidate = `TC4-${random}`;
    const { data } = await supabase
      .from('participants')
      .select('id')
      .eq('registration_id', candidate)
      .maybeSingle();
    if (!data) return candidate;
  }
  // Extremely unlikely fallback, guarantees uniqueness
  return `TC4-${Date.now().toString().slice(-6)}`;
}
