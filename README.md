# PromptLens AI

Turn any image into a powerful AI image-generation prompt. Upload a reference image, pick a style mode and detail level, and PromptLens AI generates a detailed, ready-to-use prompt for image generators (Midjourney, Stable Diffusion, DALL·E, etc.) via OpenRouter's vision models.

## Features

- **Image upload** — drag & drop or file picker (JPG, PNG, WEBP, max 10 MB)
- **Client-side image compression** — images auto-compressed before sending to API (max 1024px, JPEG quality 0.82)
- **Prompt modes** — General, Photorealistic, Cinematic, Artistic, Product Photography
- **Detail levels** — Concise, Detailed, Ultra Detailed
- **Visual analysis** — subject, composition, lighting, style, mood, colors
- **Export** — copy to clipboard or download as `.txt`
- **Regenerate** — iterate on the same image instantly
- **Completeness score** — heuristic indicator (0–100) of prompt coverage
- **Backend proxy (optional)** — API key hidden server-side for production use

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

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite`)
- OpenRouter API (vision models, proxied via optional Express backend; key never exposed to the browser)
- Node.js / Express (server-side proxy, optional; see [Backend Setup](#backend-setup))

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

**For client-only mode (MVP, key in bundle):**

```env
VITE_OPENROUTER_API_KEY=sk-or-xxxxxx
VITE_OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
VITE_SITE_URL=http://localhost:5173
VITE_SITE_NAME=PromptLens AI
```

**For backend proxy mode (key on server only, nggak kelihatan client):**

```env
# Di server: isi OPENROUTER_API_KEY (key yang bikin request ke OpenRouter)
OPENROUTER_API_KEY=sk-or-xxxxxx

# Di client: cuma butuh model (key ga dipakai browser)
VITE_OPENROUTER_MODEL=minimax/minimax-m3:free
VITE_SITE_URL=https://your-domain.com
VITE_SITE_NAME=PromptLens AI
```

> **Tip**: Pakai backend proxy kalau mau key rahasia di browser. Tanpa proxy, key diembed ke JS bundle (lebih mudah, OK buat pribadi/learning).

### Run the Dev Server

```bash
npm run dev
```

Printed URL: default `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

### Run in Production (with backend)

```bash
npm run build
npm run start
```

Akses URL hasil build (default `http://localhost:5173`). Server backend berjalan di `http://localhost:3001` (default) pakai `node server/index.js`.

## Backend Setup (optional — menyembunyikan API key)

Tambahan opsional buat kamu yang mau key OpenRouter nggak kelihatan di browser.

1. Pastikan punya `OPENROUTER_API_KEY` di environment server (VPS/Railway/Render/etc.)
2. Jalankan server:

```bash
npm run start
```

3. Dev server (auto proxy `/api` → backend):

```bash
npm run dev
```

4. Request `POST /api/generate-prompt` dari client akan otomatis dialihkan ke backend, lalu ke OpenRouter. Key aman di server.

**Setup ringan tanpa membeli VPS**: kamu bisa pakai layanan gratis seperti [Railway](https://railway.app/) atau [Render](https://render.com/), buat repo, push folder `promptlens/`, lalu tambah environment variable `OPENROUTER_API_KEY` di dashboard mereka.

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
│   │   └── openrouter.js       # OpenRouter fetch + response parsing (anggil /api/generate-prompt)
│   ├── utils/
│   │   ├── image.js            # Validation + base64 + client-side compression
│   │   └── prompt.js           # Modes, detail levels, system prompt, scoring
│   ├── App.jsx
│   └── main.jsx
├── server/
│   └── index.js              # Express backend proxy (optional, menyembunyikan key)
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_OPENROUTER_API_KEY` | Yes (client mode) | — | OpenRouter API key — dipakai jika mode client-only (terembed ke JS) |
| `OPENROUTER_API_KEY` | Yes (backend mode) | — | OpenRouter API key — dipakai server-side, nggak kebaca browser |
| `VITE_OPENROUTER_MODEL` | No | `google/gemini-2.0-flash-exp:free` | Vision model to use (sent in client request) |
| `VITE_SITE_URL` | No | `window.location.origin` | Referer header for OpenRouter |
| `VITE_SITE_NAME` | No | `PromptLens AI` | Title header for OpenRouter |

## Security Notes

- **Client-only mode (tanpa proxy)**: key diembed ke JS bundle (`VITE_OPENROUTER_API_KEY`). Bisa dilihat orang yang buka DevTools. OK buat learning, local use, atau MVP cepat. **Jangan pakai di production publik tanpa bantuan keamanan lainnya.**
- **Backend proxy mode**: key disimpan di `OPENROUTER_API_KEY` di environment server. Request ke OpenRouter dari sisi server, jadi key nggak pernah lewat browser. Rekomendasi buat deployment produksi.

## Limitations

- Progress steps are a UX indicator and do not reflect real API progress.
- Generated prompts depend on the chosen vision model's quality.
- Images are processed in-browser (compressed) and are not permanently stored.
- Free model availability on OpenRouter bisa berubah; kalau 429 coba model lain lewat `VITE_OPENROUTER_MODEL`.
