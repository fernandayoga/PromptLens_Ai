export const PROMPT_MODES = [
  {
    id: 'general',
    label: 'General',
    description: 'A balanced prompt suitable for most image generators.',
  },
  {
    id: 'photorealistic',
    label: 'Photorealistic',
    description: 'Emphasize realism, true-to-life textures and natural detail.',
  },
  {
    id: 'cinematic',
    label: 'Cinematic',
    description: 'Film-like framing, dramatic lighting and mood.',
  },
  {
    id: 'artistic',
    label: 'Artistic',
    description: 'Stylized, painterly and expressive visual treatment.',
  },
  {
    id: 'product',
    label: 'Product Photography',
    description: 'Clean studio lighting and commercial product presentation.',
  },
]

export const DETAIL_LEVELS = [
  {
    id: 'concise',
    label: 'Concise',
    description: 'Short and direct, key elements only.',
  },
  {
    id: 'detailed',
    label: 'Detailed',
    description: 'Balanced description with supporting detail.',
  },
  {
    id: 'ultra',
    label: 'Ultra Detailed',
    description: 'Maximum depth across every visual dimension.',
  },
]

const MODE_GUIDANCE = {
  general: 'Write a clear, general-purpose image-generation prompt.',
  photorealistic:
    'Write a photorealistic prompt: emphasize real-world materials, skin and surface texture, natural lighting, lens characteristics and believable detail. Avoid illustration or painting styles.',
  cinematic:
    'Write a cinematic prompt: emphasize film composition, aspect ratio, camera movement feel, lens choice, color grading, contrast and dramatic mood.',
  artistic:
    'Write an artistic prompt: emphasize stylization, medium (e.g. oil, watercolor, digital painting), brushwork, palette and expressive interpretation rather than literal realism.',
  product:
    'Write a product photography prompt: emphasize clean studio background, soft even lighting, reflective or matte surfaces, hero framing, high commercial quality and accurate product presentation.',
}

const DETAIL_GUIDANCE = {
  concise:
    'Keep the prompt concise: 1-2 sentences covering the most important visual elements only.',
  detailed:
    'Write a detailed prompt: 3-6 sentences covering subject, composition, lighting, color, style, mood and key details.',
  ultra:
    'Write an ultra-detailed prompt: a thorough paragraph covering subject, pose/action, composition, camera angle/distance/lens, lighting, color palette, environment, style, mood, depth of field and every important visual detail.',
}

export function buildSystemPrompt(mode, detailLevel) {
  const modeId = (mode || 'general').toLowerCase()
  const detailId = (detailLevel || 'detailed').toLowerCase()
  const modeText = MODE_GUIDANCE[modeId] || MODE_GUIDANCE.general
  const detailText = DETAIL_GUIDANCE[detailId] || DETAIL_GUIDANCE.detailed

  return `You are an expert visual analyst for AI image generation. Your task is NOT to caption the image or describe it casually. You must produce a detailed, usable image-generation prompt that can recreate a visually similar image.

${modeText}
${detailText}

Analyze the reference image across these dimensions and use them to build the prompt:
- Subject (what/who is in the image)
- Composition (framing, rule of thirds, negative/positive space)
- Pose / action (if any)
- Camera angle, distance and lens (only if inferable)
- Lighting (direction, quality, time of day, sources)
- Color palette
- Environment / setting
- Style
- Mood / atmosphere
- Depth of field
- Any other important visual details

Rules:
- Focus strictly on visual characteristics.
- Do not invent details that cannot be seen in the image.
- Do not claim personal identity, names, or private information not visible in the image.
- Do not promise a perfect reproduction.
- The primary output must always be an image-generation prompt, not a caption.

Respond with raw JSON only, using this exact shape:
{
  "prompt": "<the image-generation prompt>",
  "analysis": {
    "subject": "...",
    "composition": "...",
    "lighting": "...",
    "style": "...",
    "mood": "...",
    "colors": "..."
  }
}

Do not wrap the JSON in markdown code fences or backticks. Output the JSON object directly.
If you cannot return strict JSON, still return the prompt as the first line after "PROMPT:" and the analysis as key-value lines.`
}

export function computeCompleteness(prompt, analysis = {}) {
  let score = 0
  const max = 100

  const text = (prompt || '').trim()
  if (text.length >= 40) score += 20
  if (text.length >= 120) score += 10
  if (text.length >= 260) score += 10

  const attrs = [
    /composition|framing|rule of thirds/i,
    /light|candle|studio|sun|shadow|glow|neon/i,
    /color|palette|tone|hue/i,
    /style|realistic|cinematic|painterly|anime/i,
    /(lens|f\/|mm|wide|telephoto|macro|35mm|50mm|85mm)/i,
    /(mood|atmospher|vibe|feeling)/i,
    /(depth of field|bokeh|blur|sharp focus)/i,
    /(background|environment|setting|scene)/i,
  ]
  const hit = attrs.filter((re) => re.test(text)).length
  score += Math.min(hit * 6, 36)

  const fields = ['subject', 'composition', 'lighting', 'style', 'mood', 'colors']
  const filled = fields.filter((f) => (analysis?.[f] || '').trim().length > 0).length
  score += Math.round((filled / fields.length) * 14)

  return Math.max(0, Math.min(max, score))
}

export function downloadPrompt(text, filename = 'promptlens-prompt.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}