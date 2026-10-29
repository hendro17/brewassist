# BrewAssist — AI Coffee Recipe Builder

Monorepo: `app` Vue3 + `server` Hono + `admin` later.

## Locked decisions
- Stack: Vue3, Pinia, Tailwind, Shadcn-Vue, PWA, Native Web Audio timer.
- Backend: Node Hono recipe engine + KB validator.
- Wizard: 3 stages. S1 inputs, S2 resume + recipe + brew assist, S3 resume + feedback + adjust + save.
- Scope MVP: full matrix hot + ice all manual brew (C6c).
- SAAS: separate admin panel, shared Supabase. Roles ready. Auth skipped early debug.
- RND source: `../../findings/brewlogic-06-rnd-complete.md` is SSOT numbers.
