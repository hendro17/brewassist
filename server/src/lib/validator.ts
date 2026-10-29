// KB validator: physics gates before LLM output accepted.
export function validateRecipe(input: any, recipe: any): { ok: boolean; errors: string[] } {
  const e: string[] = []
  const m = recipe.mods
  if (m.temp_c < 88 || m.temp_c > 94) e.push(`temp ${m.temp_c} out of 88-94`)
  if (m.ratio < 14 || m.ratio > 17) e.push(`ratio 1:${m.ratio} out of 1:14-17`)
  if (m.bloom_mult < 2 || m.bloom_mult > 3) e.push(`bloom ${m.bloom_mult}x out of 2-3x`)
  if (m.grind_um < 300 || m.grind_um > 1200) e.push(`grind ${m.grind_um}um out of 300-1200`)
  return { ok: e.length === 0, errors: e }
}
