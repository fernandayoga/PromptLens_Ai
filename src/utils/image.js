const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported format. Please use JPG, JPEG, PNG, or WEBP.',
    }
  }
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum size is 10 MB.`,
    }
  }
  if (file.size === 0) {
    return { valid: false, error: 'The selected file appears to be empty.' }
  }
  return { valid: true, error: null }
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read the image file.'))
    reader.readAsDataURL(file)
  })
}

export function compressImage(file, { maxDim = 1024, quality = 0.82, type = 'image/jpeg' } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read the image file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load the image.'))
      img.onload = () => {
        let { width, height } = img
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL(type, quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export { ALLOWED_TYPES, MAX_SIZE }