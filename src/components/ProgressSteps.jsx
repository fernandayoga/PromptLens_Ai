export default function ProgressSteps({ stages = [], activeStage = 0 }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin-slow" />
        <h3 className="text-sm font-semibold text-text">Analyzing your image</h3>
      </div>
      <ol className="space-y-2.5">
        {stages.map((label, index) => {
          const done = index < activeStage
          const current = index === activeStage
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  done
                    ? 'bg-primary text-white'
                    : current
                    ? 'bg-primary/10 text-primary animate-pulse-slow'
                    : 'bg-border/50 text-text-muted'
                }`}
                aria-hidden="true"
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`transition-colors ${
                  current ? 'text-text font-medium' : done ? 'text-text' : 'text-text-muted'
                }`}
              >
                {label}
                {current && <span className="sr-only"> (in progress)</span>}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-4 text-xs text-text-muted">
        These steps show the analysis process. Your prompt will appear when it's ready.
      </p>
    </div>
  )
}