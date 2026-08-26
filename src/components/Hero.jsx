export default function Hero() {
  return (
    <section className="w-full py-10 lg:py-16 bg-gradient-to-b from-primary-light/30 to-transparent" id="how-it-works">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-text tracking-tight animate-fade-in">
          Turn Any Image Into a{' '}
          <span className="text-primary">Powerful AI Prompt</span>
        </h1>
        <p className="mt-4 text-lg lg:text-xl text-text-muted max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Upload a reference image and let AI analyze its visual characteristics to generate a detailed
          image-generation prompt you can use anywhere.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-text-muted animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="M21 15l-5-5L5 17" />
            </svg>
            JPG, PNG, WEBP
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            Max 10 MB
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            No login required
          </span>
        </div>
      </div>
    </section>
  )
}