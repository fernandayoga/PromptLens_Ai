export default function GenerateButton({ onClick, disabled, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white transition-all ${
        disabled || loading
          ? 'bg-primary/40 cursor-not-allowed'
          : 'bg-primary hover:bg-primary-hover shadow-sm hover:shadow-md'
      }`}
    >
      {loading ? (
        <>
          <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
          Generating…
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Generate Prompt
        </>
      )}
    </button>
  )
}