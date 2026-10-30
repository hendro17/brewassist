// Hardware options mirrored from server/src/db/seed-hardware.sql (B6/B7/B9/B10).
// shortcut: static mirror, no Supabase client. Upgrade to API lookup when server gets DB client.
export const GRINDERS = [
  '1Zpresso J-Ultra',
  '1Zpresso K-Ultra',
  '1Zpresso K-Plus/K-Pro/K-Max/ZP6',
  '1Zpresso X-Ultra/X-Pro S',
  'Timemore C2',
  'Timemore C3/C3S',
  'Timemore C5 Pro',
  'Timemore S3',
  'Comandante C40 MK4',
  'Comandante C60',
] as const

export const WATERS = ['Aqua', 'Le Minerale', 'Cleo', 'Amidis'] as const

export const FILTERS = [
  'Cafec T-92 Light',
  'Cafec T-90 Medium-Dark',
  'Cafec T-83 Dark',
  'Cafec Abaca/Abaca+',
  'Hario Tabbed Japan',
  'Hario Untabbed',
  'Chemex Bonded',
  'Sibarist FAST',
  'Sibarist B3',
] as const

export const DRIPPERS = [
  'Hario V60',
  'Origami Cone',
  'Origami Wave',
  'Kalita Wave',
  'Orea V3/V4',
  'April',
  'Chemex',
  'Aeropress filter-style',
] as const
