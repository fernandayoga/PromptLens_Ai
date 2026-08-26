import { useState } from 'react'

const TOAST_DELAY = 3000

export default function PromptResult({
  prompt,
  completeness,
  onCopy,
  onDownload,
  onRegenerate,
}) {
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), TOAST_DELAY)
  }

  const handleCopy = async () => {
    try {
      await onCopy()
      setCopied(true)
      showToast('Prompt copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('Failed to copy prompt')
    }
  }

  const handleDownload = () => {
    onDownload()
    showToast('Prompt downloaded')
  }

  const pct = Math.round(completeness || 0)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-text">Generated Prompt</h2>
          <div
            className="flex items-center gap-1.5 text-xs text-text-muted"
            title="Prompt completeness indicator based on covered visual attributes"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 12h-4l-3 9-5-13-5 13-3-9H2" />
            </svg>
            <span>Prompt completeness</span>
            <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-9 text-right">{pct}%</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={prompt}
            className="w-full min-h-[240px] max-h-[480px] resize-none rounded-xl bg-surface-hover border border-border px-3 py-2.5 text-sm text-text placeholder-text-muted focus:outline-none scrollbar-thin read-only:cursor-default"
            placeholder="Your generated prompt will appear here..."
          />
        </div>
        <div className="mt-2 text-right">
          <span className="text-xs text-text-muted">
            {prompt.split(' ').length} words
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text hover:bg-surface-hover transition-colors"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15h4v4M5 5h4v4M13 5h4v4M13 15h4v4" />
              </svg>
              Copy Prompt
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text hover:bg-surface-hover transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10l5 5 5-5" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>

        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 0 1 9-9 9.77 9.77 0 0 1 6.84 2.79L16 8" />
            <path d="M21 12a9 9 0 0 1-9 9 9.77 9.77 0 0 1-6.84-2.79L8 16" />
          </svg>
          Regenerate
        </button>

        </div>

      {toast && (
        <div className="toast fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-lg bg-text text-white text-sm shadow-lg flex items-center gap-2">
          {toast}
        </div>
      )}
    </div>
  )
}