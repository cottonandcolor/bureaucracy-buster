'use client'

import { useState, useRef } from 'react'

interface AnalysisResult {
  summary: string
  action_required: string
  deadline: string
  reassurance: string
}

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyzeImage = async (imageData: string, mimeType: string) => {
    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, mimeType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze document')
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message || 'We couldn\'t read that. Can you try a clearer photo?')
      console.error('Error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const captureFromCamera = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg')
    await analyzeImage(imageData, 'image/jpeg')
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target?.result as string
      await analyzeImage(imageData, file.type)
    }
    reader.readAsDataURL(file)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
    }
    setShowCamera(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <nav className="bg-white shadow-md sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">🧠 Executive Function Copilot</h1>
            <div className="flex gap-4">
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium" aria-label="Home">
                Bureaucracy Buster
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
            📄 Bureaucracy Buster
          </h2>
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            Point your camera at a complex form, letter, or document. We'll tell you exactly
            what it is, when it's due, and what you need to do.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg mb-6" role="complementary" aria-label="How it works">
            <h3 className="font-bold text-blue-900 mb-2 text-lg">How it works:</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-2 text-base">
              <li>Use your camera to scan a document, or upload an image</li>
              <li>AI analyzes the document and extracts key information</li>
              <li>Get three simple answers: What is it? When is it due? What do I do?</li>
              <li>Plus a reassuring message to help you feel calm</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-4 mb-6" role="group" aria-label="Document input options">
            {!showCamera ? (
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition-all hover:-translate-y-0.5 min-w-[180px]"
                aria-label="Open camera to capture document"
              >
                📷 Open Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="bg-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-700 hover:shadow-lg transition-all min-w-[180px]"
                aria-label="Stop camera"
              >
                Stop Camera
              </button>
            )}

            <label className="bg-white border-3 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 cursor-pointer transition-all min-w-[180px] text-center">
              📤 Upload Image
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                aria-label="Upload document image"
              />
            </label>
          </div>

          {showCamera && (
            <div className="mb-6" role="region" aria-label="Camera view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
                aria-label="Document camera preview"
              />
              <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
              <div className="flex justify-center mt-4">
                <button
                  onClick={captureFromCamera}
                  disabled={isAnalyzing}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[220px] justify-center"
                  aria-label={isAnalyzing ? 'Analyzing document' : 'Capture and analyze document'}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" aria-hidden="true"></div>
                      Analyzing...
                    </>
                  ) : (
                    '📸 Capture & Analyze'
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-5 rounded-lg mb-6" role="alert" aria-live="assertive">
              <strong className="font-bold">We hit a snag:</strong>
              <p className="mt-1 text-lg">{error}</p>
            </div>
          )}

          {results && (
            <div className="mt-8 pt-8 border-t-4 border-blue-200" role="region" aria-label="Document analysis results" aria-live="polite">
              {/* Reassurance Message - Displayed FIRST per PRD */}
              <div className="bg-green-50 border-2 border-green-400 p-6 rounded-2xl mb-6 shadow-md">
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden="true">💚</span>
                  <div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">You've Got This!</h2>
                    <p className="text-xl text-green-800 leading-relaxed">
                      {results.reassurance}
                    </p>
                  </div>
                </div>
              </div>

              {/* What is it? - Summary */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span aria-hidden="true">📄</span>
                  What is it?
                </h3>
                <p className="text-xl text-gray-800 leading-relaxed">
                  {results.summary}
                </p>
              </div>

              {/* When is it due? - Deadline (prominently highlighted) */}
              <div className={`${
                results.deadline.toLowerCase() !== 'none'
                  ? 'bg-orange-100 border-4 border-orange-500'
                  : 'bg-gray-100 border-2 border-gray-400'
              } p-6 rounded-lg mb-6 shadow-lg`}>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${
                  results.deadline.toLowerCase() !== 'none'
                    ? 'text-orange-900'
                    : 'text-gray-700'
                }`}>
                  <span aria-hidden="true">📅</span>
                  When is it due?
                </h3>
                <p className={`text-3xl font-bold ${
                  results.deadline.toLowerCase() !== 'none'
                    ? 'text-orange-900'
                    : 'text-gray-700'
                }`}>
                  {results.deadline}
                </p>
              </div>

              {/* What do I do? - Action Required (MOST PROMINENT per PRD) */}
              <div className="bg-blue-600 text-white p-8 rounded-2xl mb-6 shadow-2xl border-4 border-blue-800">
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                  <span aria-hidden="true">✅</span>
                  What do I do?
                </h3>
                <p className="text-2xl font-bold leading-relaxed">
                  {results.action_required}
                </p>
              </div>

              <button
                onClick={() => setResults(null)}
                className="w-full bg-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all shadow-md"
                aria-label="Analyze another document"
              >
                Analyze Another Document
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

