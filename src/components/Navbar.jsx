export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <a href="/" className="flex items-center gap-2 text-xl font-bold text-text" aria-label="PromptLens AI Home">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
              <circle cx="18" cy="18" r="3" />
            </svg>
            <span>PromptLens AI</span>
          </a>
        </div>
      </div>
    </header>
  )
}