import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

import serverEntry from './dist/server/server.js'

const app = new Hono()

app.use('/*', serveStatic({ root: './dist/client' }))

app.all('*', async (c) => {
  try {
    const ctx = {
      waitUntil: (promise) => {
        promise.catch(console.error)
      },
      passThroughOnException: () => {}
    }
    const res = await serverEntry.fetch(c.req.raw, process.env, ctx)
    return res;
  } catch (err) {
    console.error("Fetch Error:", err);
    return c.text("Error: " + String(err), 500);
  }
})

const port = process.env.PORT || 3000
console.log(`Starting server on port ${port}`)
serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })
