import { useState, useRef, useEffect } from 'react'
import { generatePrompt } from '../services/openrouter.js'

export const STAGES = [
  'Uploading image',
  'Analyzing visual elements',
  'Understanding composition',
  'Analyzing lighting & colors',
  'Identifying visual style',
  'Crafting image prompt',
  'Finalizing result',
]

export const STATES = {
  EMPTY: 'EMPTY',
  IMAGE_SELECTED: 'IMAGE_SELECTED',
  ANALYZING: 'ANALYZING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

const STAGE_INTERVAL = 1400

export function useImagePrompt() {
  const [status, setStatus] = useState(STATES.EMPTY)
  const [stage, setStage] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const stageTimer = useRef(null)
  const abortCtrl = useRef(null)

  function clearStageTimer() {
    if (stageTimer.current) {
      clearInterval(stageTimer.current)
      stageTimer.current = null
    }
  }

  function startStageCycle() {
    clearStageTimer()
    setStage(0)
    stageTimer.current = setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1))
    }, STAGE_INTERVAL)
  }

  async function generate({ dataUrl, mode, detailLevel }) {
    if (abortCtrl.current) {
      abortCtrl.current.abort()
    }
    abortCtrl.current = new AbortController()

    setStatus(STATES.ANALYZING)
    startStageCycle()
    setError(null)
    setResult(null)

    try {
      const data = await generatePrompt({
        dataUrl,
        mode,
        detailLevel,
        signal: abortCtrl.current.signal,
      })
      setResult(data)
      setStatus(STATES.SUCCESS)
      setStage(STAGES.length - 1)
    } catch (err) {
      if (err?.name === 'AbortError') return
      setError(err?.message || 'Something went wrong.')
      setStatus(STATES.ERROR)
    } finally {
      clearStageTimer()
    }
  }

  function reset() {
    clearStageTimer()
    if (abortCtrl.current) {
      abortCtrl.current.abort()
      abortCtrl.current = null
    }
    setStatus(STATES.EMPTY)
    setStage(0)
    setResult(null)
    setError(null)
  }

  function regenerate({ dataUrl, mode, detailLevel }) {
    setResult(null)
    generate({ dataUrl, mode, detailLevel })
  }

  useEffect(() => {
    return () => clearStageTimer()
  }, [])

  return {
    status,
    stage,
    stages: STAGES,
    result,
    error,
    generate,
    regenerate,
    reset,
  }
}
