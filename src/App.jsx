import { useState } from 'react'
import { useImagePrompt } from './hooks/useImagePrompt.js'
import { PROMPT_MODES, DETAIL_LEVELS, computeCompleteness, downloadPrompt } from './utils/prompt.js'
import { validateImageFile, fileToDataUrl } from './utils/image.js'

import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import ImageUploader from './components/ImageUploader.jsx'
import ImagePreview from './components/ImagePreview.jsx'
import PromptSettings from './components/PromptSettings.jsx'
import GenerateButton from './components/GenerateButton.jsx'
import ProgressSteps from './components/ProgressSteps.jsx'
import PromptResult from './components/PromptResult.jsx'
import AnalysisPanel from './components/AnalysisPanel.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const {
    status,
    stage,
    stages,
    result,
    error,
    generate,
    regenerate,
    reset,
  } = useImagePrompt()

  const [image, setImage] = useState({ file: null, dataUrl: null })
  const [uploadError, setUploadError] = useState(null)
  const [mode, setMode] = useState('general')
  const [detailLevel, setDetailLevel] = useState('detailed')

  async function handleFileSelect(file) {
    setUploadError(null)
    reset()
    const { valid, error: validationError } = validateImageFile(file)
    if (!valid) {
      setUploadError(validationError)
      return
    }
    try {
      const dataUrl = await fileToDataUrl(file)
      setImage({ file, dataUrl })
    } catch {
      setUploadError('Failed to read the image file. Please try another image.')
    }
  }

  function handleRemoveImage() {
    setImage({ file: null, dataUrl: null })
    setUploadError(null)
    reset()
  }

  function handleGenerate() {
    if (!image.dataUrl || status === 'ANALYZING') return
    generate({ dataUrl: image.dataUrl, mode, detailLevel })
  }

  function handleRegenerate() {
    if (!image.dataUrl || status === 'ANALYZING') return
    regenerate({ dataUrl: image.dataUrl, mode, detailLevel })
  }

  function handleCopy() {
    if (!result?.prompt) return Promise.resolve()
    return navigator.clipboard.writeText(result.prompt)
  }

  function handleDownload() {
    if (!result?.prompt) return
    downloadPrompt(result.prompt)
  }

  const isAnalyzing = status === 'ANALYZING'
  const showGenerator =
    status !== 'EMPTY' || !!image.dataUrl

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />

        {!showGenerator && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <div className="grid lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3 animate-fade-in">
                <ImageUploader
                  onFileSelect={handleFileSelect}
                  disabled={isAnalyzing}
                />
                {uploadError && (
                  <p role="alert" className="mt-3 text-sm text-error">
                    {uploadError}
                  </p>
                )}
              </div>
              <aside className="lg:col-span-2 space-y-4 text-sm text-text-muted">
                <h2 className="text-base font-semibold text-text">How it works</h2>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Upload a reference image (JPG, PNG, or WEBP, max 10 MB).</li>
                  <li>Choose a prompt mode and detail level.</li>
                  <li>Click Generate and wait for the AI analysis.</li>
                  <li>Copy the generated prompt and use it anywhere.</li>
                </ol>
                <p className="text-xs leading-relaxed">
                  Your image is used only for AI analysis and is not stored by this application.
                </p>
              </aside>
            </div>
          </section>
        )}

        {showGenerator && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <ImagePreview
                  file={image.file}
                  dataUrl={image.dataUrl}
                  onRemove={handleRemoveImage}
                  disabled={isAnalyzing}
                />
                <PromptSettings
                  mode={mode}
                  detailLevel={detailLevel}
                  onModeChange={setMode}
                  onDetailChange={setDetailLevel}
                  modes={PROMPT_MODES}
                  details={DETAIL_LEVELS}
                  disabled={isAnalyzing}
                />
                <GenerateButton
                  onClick={handleGenerate}
                  disabled={!image.dataUrl || isAnalyzing}
                  loading={isAnalyzing}
                />
              </div>

              <div className="space-y-4">
                {status === 'ANALYZING' && (
                  <ProgressSteps stages={stages} activeStage={stage} />
                )}

                {(status === 'SUCCESS' || status === 'ERROR') && (
                  <>
                    <PromptResult
                      prompt={result?.prompt || ''}
                      completeness={computeCompleteness(result?.prompt, result?.analysis)}
                      onCopy={handleCopy}
                      onDownload={handleDownload}
                      onRegenerate={handleRegenerate}
                    />
                    <AnalysisPanel analysis={result?.analysis || {}} />
                  </>
                )}

                {status === 'IMAGE_SELECTED' && (
                  <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted">
                    Configure your settings, then click{' '}
                    <span className="font-medium text-text">Generate Prompt</span> to analyze
                    your reference image.
                  </div>
                )}

                {status === 'ERROR' && (
                  <p role="alert" className="text-sm text-error">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}