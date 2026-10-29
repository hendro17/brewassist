// Deterministic modifiers from 06-rnd-complete SSOT.
// um-first grind, B6/B7/B9/B10 tables abbreviated; full tables in DB seed later.
export function computeModifiers(i: any) {
  const age_days = Math.floor((Date.now() - new Date(i.roast_date).getTime()) / 86400000)
  const roastTemp: Record<string, number> = { light: 93.5, 'light-to-medium': 92.5, medium: 91.5, 'medium-to-dark': 90.5, dark: 90 }
  const roastCap: Record<string, [number, number]> = { light: [93, 94], 'light-to-medium': [92, 93], medium: [91, 92], 'medium-to-dark': [90, 91], dark: [90, 91] }

  let grind_um = 700
  let bloom_s = 35
  let temp = roastTemp[i.roast_level] ?? 92

  if (i.altitude_masl > 1370) { grind_um -= 60; temp += 1; bloom_s += 15 }
  else if (i.altitude_masl >= 1200) { grind_um -= 30; bloom_s += 10 }
  else if (i.altitude_masl < 1000) { grind_um += 60; temp -= 1 }

  if (age_days <= 7) { grind_um += 60; temp -= 1 }

  const cap = roastCap[i.roast_level] ?? [88, 94]
  temp = Math.min(Math.max(temp, cap[0]), cap[1])

  const axis: Record<string, any> = {
    acid: { r: 16, b: 3, s: 45 }, sweet: { r: 15, b: 2, s: 30 },
    balance: { r: 16, b: 2, s: 35 }, body: { r: 14, b: 2, s: 30 },
    complex: { r: 16, b: 3, s: 45 }, clean: { r: 17, b: 2.5, s: 40 },
  }
  const tg = axis[i.target] ?? axis.balance

  // fresh <7d forces acid bloom 3x/45s override; peak uses axis rule with altitude offset kept
  const bloom_mult = age_days <= 7 ? 3 : tg.b
  if (age_days <= 7) bloom_s = 45
  else bloom_s = Math.max(bloom_s, tg.s)

  return { age_days, grind_um, temp_c: temp, bloom_mult, bloom_s, ratio: tg.r }
}
