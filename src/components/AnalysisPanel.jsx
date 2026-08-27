import { useState } from 'react'

const FIELDS = [
  { key: 'subject', label: 'Subject' },
  { key: 'composition', label: 'Composition' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'style', label: 'Style' },
  { key: 'mood', label: 'Mood' },
  { key: 'colors', label: 'Color Palette' },
]

export default function AnalysisPanel({ analysis = {} }) {
  const [open, setOpen] = useState(false)
  const items = FIELDS.filter((f) => (analysis[f.key] || '').trim())

  if (items.length === 0) return null

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden animate-fade-in">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="analysis-body"
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-surface-hover transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
          Visual Analysis
          <span className="text-xs font-normal text-text-muted">({items.length})</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          {open ? 'Hide' : 'Show'}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

       {open && (
        <div id="analysis-body" className="px-5 pb-5 space-y-2 animate-slide-up">
          {items.map(({ key, label }) => (
            <div key={key} className="rounded-xl border border-border bg-surface-hover px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{label}</dt>
              <dd className="text-sm text-text leading-relaxed">{analysis[key]}</dd>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}