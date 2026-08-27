import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load env: prefer .env.local, then .env
for (const file of ['.env.local', '.env']) {
  const full = path.join(__dirname, '..', file)
  if (fs.existsSync(full)) dotenv.config({ path: full })
}

const app = express()
const PORT = process.env.PORT || 3001
const OR_URL = 'https://openrouter.ai/api/v1/chat/completions'

app.use(express.json({ limit: '25mb' }))

app.post('/api/generate-prompt', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing OPENROUTER_API_KEY. Set it on the server environment.',
    })
  }
  if (!req.body || !req.body.messages) {
    return res.status(400).json({ error: 'Invalid request body.' })
  }

  try {
    const upstream = await fetch(OR_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VITE_SITE_URL || req.headers.origin || '',
        'X-Title': process.env.VITE_SITE_NAME || 'PromptLens AI',
      },
      body: JSON.stringify(req.body),
    })
    const text = await upstream.text()
    res.status(upstream.status)
    res.set('Content-Type', 'application/json')
    res.send(text)
  } catch {
    res.status(502).json({ error: 'Failed to reach OpenRouter.' })
  }
})

const dist = path.join(__dirname, '..', 'dist')
app.use(express.static(dist))
app.get('*', (_req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`PromptLens server running at http://localhost:${PORT}`)
})
