// Deterministic modifiers from 06-rnd-complete SSOT.
// um-first grind, B6/B7/B9/B10 tables abbreviated; full tables in DB seed later.
export function computeModifiers(i: any) {
  const age_days = Math.floor((Date.now() - new Date(i.roast_date).getTime()) / 86400000)
  let grind_um = 700, temp = 92, bloom_mult = 2, bloom_s = 35, ratio = 16
  const roastTemp: Record<string, number> = { light: 93.5, 'light-to-medium': 92.5, medium: 91.5, 'medium-to-dark': 90.5, dark: 90 }
  temp = roastTemp[i.roast_level] ?? 92
  if (i.altitude_masl > 1370) { grind_um -= 60; temp += 1; bloom_s += 15 }
  else if (i.altitude_masl >= 1200) { grind_um -= 30; bloom_s += 10 }
  else if (i.altitude_masl < 1000) { grind_um += 60; temp -= 1 }
  if (age_days <= 7) { grind_um += 60; temp -= 1; bloom_s = Math.max(bloom_s, 45) }
  const t: Record<string, any> = {
    acid: { r: 16, b: 3, s: 45 }, sweet: { r: 15, b: 2, s: 30 },
    balance: { r: 16, b: 2, s: 35 }, body: { r: 14, b: 2, s: 30 },
    complex: { r: 16, b: 3, s: 45 }, clean: { r: 17, b: 2.5, s: 40 },
  }
  const tg = t[i.target] ?? t.balance
  ratio = tg.r
  if (age_days > 7) { bloom_mult = tg.b; bloom_s = Math.max(bloom_s, tg.s) }
  else { bloom_mult = 3; bloom_s = 45 }
  return { age_days, grind_um, temp_c: temp, bloom_mult, bloom_s, ratio }
}
