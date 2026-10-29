import { Hono } from 'hono'
import { recipe } from './routes/recipe.js'
import { keys } from './routes/keys.js'

const app = new Hono()
app.get('/health', (c) => c.json({ ok: true }))
app.route('/api/recipe', recipe)
app.route('/api/keys', keys)

export default app
