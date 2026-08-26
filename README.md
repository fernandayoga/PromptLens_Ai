# PromptLens AI

Turn any image into a powerful AI image-generation prompt. Upload a reference image, pick a style mode and detail level, and PromptLens AI generates a detailed, ready-to-use prompt for image generators (Midjourney, Stable Diffusion, DALL·E, etc.) via OpenRouter's vision models.

## Features

- **Image upload** — drag & drop or file picker (JPG, PNG, WEBP, max 10 MB)
- **Prompt modes** — General, Photorealistic, Cinematic, Artistic, Product Photography
- **Detail levels** — Concise, Detailed, Ultra Detailed
- **Visual analysis** — subject, composition, lighting, style, mood, colors
- **Export** — copy to clipboard or download as `.txt`
- **Regenerate / Clear** — iterate on the same image instantly
- **Completeness score** — heuristic indicator (0–100) of prompt coverage

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite`)
- OpenRouter API (vision models, no backend required for MVP)

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- An OpenRouter API key — [get one here](https://openrouter.ai/keys)

### Installation

```bash
cd promptlens
npm install
```

### Configure Environment

Copy the example env file and fill in your key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Required
VITE_OPENROUTER_API_KEY=sk-or-xxxxxx

# Optional — defaults to the free Gemini model
VITE_OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free

# Optional — used for OpenRouter attribution headers
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=PromptLens AI
```

> The API key lives in the client bundle (Vite env). This is fine for an MVP. For production, proxy requests through a backend to keep the key secret — see [Security Notes](#security-notes).

### Run the Dev Server

```bash
npm run dev
```

Open the printed URL (default `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. Upload a reference image (JPG, PNG, or WEBP, max 10 MB).
2. Choose a prompt **mode** and **detail level**.
3. Click **Generate Prompt** and wait for the AI analysis.
4. Copy or download the prompt and use it in your image generator.

## Project Structure

```
promptlens/
├── src/
│   ├── components/      # UI components (Navbar, Hero, ImageUploader, PromptResult, ...)
│   ├── hooks/
│   │   └── useImagePrompt.js   # State machine for the generation flow
│   ├── services/
│   │   └── openrouter.js       # OpenRouter fetch + response parsing
│   ├── utils/
│   │   ├── image.js            # Validation + base64 conversion
│   │   └── prompt.js           # Modes, detail levels, system prompt, scoring
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
└── vite.config.js
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_OPENROUTER_API_KEY` | Yes | — | OpenRouter API key |
| `VITE_OPENROUTER_MODEL` | No | `google/gemini-2.0-flash-exp:free` | Vision model to use |
| `VITE_SITE_URL` | No | `window.location.origin` | Referer header for OpenRouter |
| `VITE_SITE_NAME` | No | `PromptLens AI` | Title header for OpenRouter |

## Security Notes

- **MVP**: the OpenRouter key is exposed in the client bundle. Acceptable for local/personal use.
- **Production**: the PRD recommends a backend route (e.g. `/api/generate-prompt`) to hold the key server-side and proxy requests to OpenRouter, preventing key exposure.

## Limitations

- Progress steps are a UX indicator and do not reflect real API progress.
- Generated prompts depend on the chosen vision model's quality.
- Images are processed in-browser and are not stored by the app.
