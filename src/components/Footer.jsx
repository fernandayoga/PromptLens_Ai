export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface/50 py-8 lg:py-12" id="about">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p className="text-center md:text-left">
            PromptLens AI &copy; {new Date().getFullYear()} — Made for AI image prompt generation.
          </p>
          <div className="flex items-center gap-6 text-xs">
            <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
              Powered by OpenRouter
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}