import { useState, useCallback, useRef } from 'react'

export default function ImageUploader({ onFileSelect, disabled }) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0])
      }
    },
    [onFileSelect],
  )

  const handleClick = useCallback(() => {
    if (disabled) return
    fileInputRef.current?.click()
  }, [disabled])

  const handleFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0])
      }
    },
    [onFileSelect],
  )

  return (
    <div
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
        dragActive
          ? 'border-primary bg-primary-light drag-over'
          : 'border-border hover:border-primary/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && handleClick()}
      aria-label={disabled ? 'Upload disabled during analysis' : 'Upload reference image'}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
        aria-label="Choose image file"
      />
      <div className="p-8 lg:p-12 text-center">
        <div className="mx-auto w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <h3 className="text-lg lg:text-xl font-semibold text-text mb-1">Drag & drop your reference image</h3>
        <p className="text-text-muted mb-2">or click to browse</p>
        <p className="text-xs text-text-muted">JPG, PNG, WEBP · Max 10 MB</p>
      </div>
    </div>
  )
}