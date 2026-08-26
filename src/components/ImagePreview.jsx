import { formatFileSize } from '../utils/image.js'

export default function ImagePreview({ file, dataUrl, onRemove, onReplace, disabled }) {
  if (!dataUrl) return null

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl overflow-hidden bg-surface border border-border animate-fade-in">
        <img
          src={dataUrl}
          alt="Reference image preview"
          className="w-full h-auto max-h-[400px] object-contain"
        />
        {disabled && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="animate-spin-slow w-8 h-8 border-3 border-white/30 border-t-white rounded-full mx-auto mb-2" />
              <p className="text-white text-sm font-medium">Analyzing image…</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5L5 17" />
          </svg>
          <span className="font-medium text-text truncate">{file?.name || 'image'}</span>
        </div>
        <div className="flex items-center gap-3">
          {file && <span className="text-text-muted">{formatFileSize(file.size)}</span>}
          {disabled ? (
            <button
              disabled
              className="px-3 py-1.5 text-xs text-text-muted border border-border rounded-lg"
            >
              Analyzing…
            </button>
          ) : (
            <>
              {onReplace && (
                <button
                  type="button"
                  onClick={onReplace}
                  className="px-3 py-1.5 text-xs text-text border border-border rounded-lg hover:bg-surface-hover transition-colors"
                >
                  Replace
                </button>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="px-3 py-1.5 text-xs text-error border border-error/30 rounded-lg hover:bg-error/10 transition-colors"
                >
                  Remove
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}