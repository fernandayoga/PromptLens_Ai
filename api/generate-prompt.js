import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load env: prefer .env.local, then .env
for (const file of ['.env.local', '.env']) {
  const full = path.join(__dirname, '..', file)
  if (fs.existsSync(full)) dotenv.config({ path: full })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey =
    process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error:
        'Server is missing OPENROUTER_API_KEY. Set it on the server environment.',
    })
  }

  const OR_URL = 'https://openrouter.ai/api/v1/chat/completions'

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
    res.setHeader('Content-Type', 'application/json')
    res.status(upstream.status)
    res.send(text)
  } catch {
    res.status(502).json({ error: 'Failed to reach OpenRouter.' })
  }
}
