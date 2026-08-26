export default function PromptSettings({
  mode,
  detailLevel,
  onModeChange,
  onDetailChange,
  modes = [],
  details = [],
  disabled,
}) {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface p-5">
      <fieldset disabled={disabled} className="space-y-3">
        <legend className="text-sm font-semibold text-text mb-2">Prompt Mode</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Prompt mode">
          {modes.map((m) => {
            const active = mode === m.id
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onModeChange(m.id)}
                title={m.description}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-text-muted hover:border-primary/40 hover:text-text'
                }`}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className="space-y-3">
        <legend className="text-sm font-semibold text-text mb-2">Detail Level</legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Detail level">
          {details.map((d) => {
            const active = detailLevel === d.id
            return (
              <button
                key={d.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onDetailChange(d.id)}
                title={d.description}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-text-muted hover:border-primary/40 hover:text-text'
                }`}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      {disabled && (
        <p className="text-xs text-text-muted">Settings are locked while analyzing the image.</p>
      )}
    </div>
  )
}