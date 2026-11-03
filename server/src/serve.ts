// Dev/trial server: node:http adapter for the Hono app. No extra deps.
import { createServer } from 'node:http'
import app from './index.js'

const port = Number(process.env.PORT ?? 3000)

createServer(async (req, res) => {
  const url = `http://localhost:${port}${req.url}`
  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(c as Buffer)
  const body = Buffer.concat(chunks)
  try {
    const r = await app.request(url, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: body.length ? body : undefined,
    })
    res.writeHead(r.status, Object.fromEntries(r.headers.entries()))
    res.end(Buffer.from(await r.arrayBuffer()))
  } catch (e: any) {
    res.writeHead(500).end(String(e?.message ?? e))
  }
}).listen(port, () => console.log(`brewassist server on :${port}`))
