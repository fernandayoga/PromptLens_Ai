import { buildSystemPrompt } from '../utils/prompt.js'

const API_URL = '/api/generate-prompt'

export function getModel() {
  return import.meta.env.VITE_OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free'
}

function parseContent(raw) {
  const text = (raw || '').trim()
  if (!text) return { prompt: '', analysis: {} }

  // strip markdown code block if present
  let cleaned = text
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim()
  }

  const jsonStart = cleaned.indexOf('{')
  if (jsonStart !== -1) {
    const jsonCandidate = cleaned.slice(jsonStart)
    try {
      const data = JSON.parse(jsonCandidate)
      if (data && typeof data === 'object') {
        return {
          prompt: String(data.prompt || '').trim(),
          analysis: data.analysis && typeof data.analysis === 'object' ? data.analysis : {},
        }
      }
    } catch {
      /* fall through to text parsing */
    }
  }

  const promptMatch = text.match(/PROMPT:\s*([\s\S]*?)(?:\n[A-Z][a-z]+:|$)/i)
  const fallbackPrompt = promptMatch ? promptMatch[1].trim() : text

  return { prompt: fallbackPrompt, analysis: {} }
}

export async function generatePrompt({ dataUrl, mode, detailLevel, signal }) {
  const systemPrompt = buildSystemPrompt(mode, detailLevel)

  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'Analyze the attached reference image and return the image-generation prompt and visual analysis as JSON.',
        },
        { type: 'image_url', image_url: { url: dataUrl } },
      ],
    },
  ]

  let response
  try {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: getModel(),
        messages,
        temperature: 0.4,
        max_tokens: 1500,
      }),
      signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new Error('Network error. Please check your connection and try again.')
  }

  if (response.status === 429) {
    throw new Error('Rate limit reached on OpenRouter. Please wait a moment and try again.')
  }
  if (response.status === 401 || response.status === 403) {
    throw new Error('Authentication failed. Check that your OpenRouter API key is valid.')
  }
  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body?.error?.message || body?.error || ''
    } catch {
      /* ignore */
    }
    throw new Error(`Request failed (${response.status}). ${detail}`.trim())
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('The model returned an empty response. Please try again.')
  }

  const parsed = parseContent(content)
  if (!parsed.prompt) {
    parsed.prompt = content
  }
  return parsed
}