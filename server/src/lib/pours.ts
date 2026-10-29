// Deterministic pour builder from 06-rnd-complete C6 + C6b SSOT.
// um-first already in modifiers. This builds volume + bloom + timestamped pours.
export type Pour = {
  step: number
  t_ms: number
  grams: number
  method: string
  agitation: string
  note: string
}

const AXIS_POURS: Record<string, { n: number; method: string; agitation: string }> = {
  acid: { n: 4, method: 'spiral slow small split', agitation: 'high pulse' },
  sweet: { n: 4, method: 'small circle', agitation: 'low continuous' },
  balance: { n: 3, method: 'spiral slow', agitation: 'medium' },
  body: { n: 2, method: 'center big continuous', agitation: 'low continuous' },
  complex: { n: 5, method: 'split 4-5 pulse', agitation: 'high pulse' },
  clean: { n: 3, method: 'center gentle', agitation: 'minimal' },
}

export function buildEngineRecipe(inputs: any, mods: any) {
  const dose_g = Number(inputs.dose_g ?? 15)
  const ratio = mods.ratio ?? 16
  const volume_ml = dose_g * ratio
  const bloom_g = dose_g * mods.bloom_mult
  const bloom_s = mods.bloom_s
  const axis = AXIS_POURS[inputs.target] ?? AXIS_POURS.balance
  const rest_g = volume_ml - bloom_g
  const per = Math.round(rest_g / axis.n)
  const pours: Pour[] = []
  let t = bloom_s * 1000
  // bloom is step 0 at t=0
  pours.push({ step: 0, t_ms: 0, grams: bloom_g, method: 'bloom center', agitation: 'swirl once', note: `bloom ${mods.bloom_mult}x/${bloom_s}s` })
  let acc = bloom_g
  for (let i = 1; i <= axis.n; i++) {
    const isLast = i === axis.n
    const g = isLast ? volume_ml - acc : per
    acc += g
    // 30s spacing between pours, deterministic
    t += 30000
    pours.push({ step: i, t_ms: t, grams: g, method: axis.method, agitation: axis.agitation, note: `${inputs.target} pour ${i}/${axis.n}` })
  }
  const total_ms = t + 45000 // drawdown
  const mm = String(Math.floor(total_ms / 60000)).padStart(2, '0')
  const ss = String(Math.floor((total_ms % 60000) / 1000)).padStart(2, '0')
  return {
    volume_ml,
    temp_c: mods.temp_c,
    dose_g,
    ratio,
    bloom_g,
    bloom_s,
    pours,
    total_time: `${mm}:${ss}`,
    total_ms,
  }
}
