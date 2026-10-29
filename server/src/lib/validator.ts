// KB validator: physics gates before LLM output accepted.
type Check = { pass: boolean; msg: string }

export function validateRecipe(input: any, recipe: any): { ok: boolean; errors: string[] } {
  const m = recipe.mods
  const checks: Check[] = [
    { pass: m.temp_c >= 88 && m.temp_c <= 94, msg: `temp ${m.temp_c} out of 88-94` },
    { pass: m.ratio >= 14 && m.ratio <= 17, msg: `ratio 1:${m.ratio} out of 1:14-17` },
    { pass: m.bloom_mult >= 2 && m.bloom_mult <= 3, msg: `bloom ${m.bloom_mult}x out of 2-3x` },
    { pass: m.grind_um >= 300 && m.grind_um <= 1200, msg: `grind ${m.grind_um}um out of 300-1200` },
  ]
  const errors = checks.filter((c) => !c.pass).map((c) => c.msg)
  return { ok: errors.length === 0, errors }
}
