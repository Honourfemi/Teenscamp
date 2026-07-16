import { CAMP_CONFIG } from './campConfig';

// Assigns the participant to whichever platoon currently has the fewest
// confirmed (paid) members, so every platoon stays balanced.
export async function assignPlatoon(supabase: any): Promise<string> {
  const { data, error } = await supabase
    .from('participants')
    .select('platoon')
    .eq('payment_status', 'success');

  if (error) throw error;

  const counts: Record<string, number> = {};
  CAMP_CONFIG.platoons.forEach((p) => (counts[p] = 0));
  (data || []).forEach((row: any) => {
    if (row.platoon && counts[row.platoon] !== undefined) {
      counts[row.platoon]++;
    }
  });

  let minCount = Infinity;
  let candidates: string[] = [];
  for (const platoon of CAMP_CONFIG.platoons) {
    if (counts[platoon] < minCount) {
      minCount = counts[platoon];
      candidates = [platoon];
    } else if (counts[platoon] === minCount) {
      candidates.push(platoon);
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
