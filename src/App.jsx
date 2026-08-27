import { useState } from 'react'
import { useImagePrompt } from './hooks/useImagePrompt.js'
import { PROMPT_MODES, DETAIL_LEVELS, computeCompleteness, downloadPrompt } from './utils/prompt.js'
import { validateImageFile, fileToDataUrl, compressImage } from './utils/image.js'

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
    selectImage,
  } = useImagePrompt()

  const [image, setImage] = useState({ file: null, dataUrl: null })
  const [uploadError, setUploadError] = useState(null)
  const [mode, setMode] = useState('general')
  const [detailLevel, setDetailLevel] = useState('detailed')
  const [scrollY, setScrollY] = useState(0)

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
      selectImage()
    } catch {
      setUploadError('Failed to read the image file. Please try another image.')
    }
  }

  function handleRemoveImage() {
    setImage({ file: null, dataUrl: null })
    setUploadError(null)
    reset()
  }

  async function handleGenerate() {
    if (!image.file || status === 'ANALYZING') return
    setScrollY(window.scrollY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    try {
      const compressed = await compressImage(image.file)
      generate({ dataUrl: compressed, mode, detailLevel })
    } catch {
      generate({ dataUrl: image.dataUrl, mode, detailLevel })
    }
  }

  async function handleRegenerate() {
    if (!image.file || status === 'ANALYZING') return
    try {
      const compressed = await compressImage(image.file)
      regenerate({ dataUrl: compressed, mode, detailLevel })
    } catch {
      regenerate({ dataUrl: image.dataUrl, mode, detailLevel })
    }
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
  const showTwoColumn = status === 'ANALYZING' || status === 'SUCCESS' || status === 'ERROR'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />

        {!showTwoColumn && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
            <div className="space-y-4 animate-fade-in">
              {status === 'EMPTY' ? (
                <>
                  <ImageUploader
                    onFileSelect={handleFileSelect}
                    disabled={isAnalyzing}
                  />
                  {uploadError && (
                    <p role="alert" className="mt-3 text-sm text-error">
                      {uploadError}
                    </p>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </section>
        )}

        {showTwoColumn && (
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

                {status === 'SUCCESS' && (
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