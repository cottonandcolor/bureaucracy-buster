'use client'

import { useState, useRef, useEffect } from 'react'

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
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
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

  // Text-to-Speech functionality
  const speakResults = () => {
    if (!results) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToSpeak = `${results.reassurance}. Here's what we found: ${results.summary}. ${
      results.deadline !== 'None' ? `This is due ${results.deadline}.` : 'There is no deadline.'
    } Here's what you need to do: ${results.action_required}`

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.onend = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  // Copy action to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  // Add to calendar
  const addToCalendar = () => {
    if (!results || results.deadline === 'None') return

    const title = encodeURIComponent('Action Required: ' + results.summary)
    const details = encodeURIComponent(results.action_required)
    const dates = encodeURIComponent(new Date().toISOString().split('T')[0].replace(/-/g, ''))

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dates}/${dates}`
    window.open(googleCalendarUrl, '_blank')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'u':
            e.preventDefault()
            fileInputRef.current?.click()
            break
          case 'k':
            e.preventDefault()
            startCamera()
            break
          case 'r':
            e.preventDefault()
            if (results) speakResults()
            break
          case '/':
            e.preventDefault()
            setShowKeyboardHelp(!showKeyboardHelp)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [results, showKeyboardHelp])

  return (
    <main className={`min-h-screen bg-gradient-to-br ${highContrast ? 'from-gray-900 to-black' : 'from-blue-50 to-blue-100'}`} style={{ fontSize: `${fontSize}%` }}>
      <nav className={`shadow-md sticky top-0 z-50 ${highContrast ? 'bg-black border-b-4 border-yellow-400' : 'bg-white'}`} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${highContrast ? 'text-yellow-400' : 'text-blue-600'}`}>🧠 Executive Function Copilot</h1>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                className={`px-3 py-2 rounded-lg font-medium ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                aria-label="Toggle keyboard shortcuts help"
                title="Keyboard Shortcuts (Ctrl+/)"
              >
                ⌨️
              </button>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-2 rounded-lg font-medium ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                aria-label="Toggle high contrast mode"
              >
                {highContrast ? '☀️ Normal' : '🌙 High Contrast'}
              </button>
              <button
                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                className={`px-3 py-2 rounded-lg font-medium ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                aria-label="Decrease font size"
                disabled={fontSize <= 80}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize(Math.min(140, fontSize + 10))}
                className={`px-3 py-2 rounded-lg font-medium ${highContrast ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                aria-label="Increase font size"
                disabled={fontSize >= 140}
              >
                A+
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Keyboard Shortcuts Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowKeyboardHelp(false)}>
          <div className={`rounded-xl p-6 max-w-md w-full ${highContrast ? 'bg-black border-4 border-yellow-400' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-2xl font-bold mb-4 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>⌨️ Keyboard Shortcuts</h3>
            <ul className={`space-y-2 ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>
              <li><kbd className="px-2 py-1 bg-gray-200 text-gray-900 rounded">Ctrl+U</kbd> - Upload Image</li>
              <li><kbd className="px-2 py-1 bg-gray-200 text-gray-900 rounded">Ctrl+K</kbd> - Open Camera</li>
              <li><kbd className="px-2 py-1 bg-gray-200 text-gray-900 rounded">Ctrl+R</kbd> - Read Results Aloud</li>
              <li><kbd className="px-2 py-1 bg-gray-200 text-gray-900 rounded">Ctrl+/</kbd> - Toggle This Help</li>
            </ul>
            <button
              onClick={() => setShowKeyboardHelp(false)}
              className={`mt-4 w-full px-4 py-2 rounded-lg font-bold ${highContrast ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-2xl shadow-2xl p-8 mb-8 ${highContrast ? 'bg-black border-4 border-yellow-400' : 'bg-white'}`}>
          <h2 className={`text-4xl font-bold mb-4 flex items-center gap-3 ${highContrast ? 'text-yellow-400' : 'text-gray-900'}`}>
            📄 Bureaucracy Buster
          </h2>
          <p className={`text-xl mb-6 leading-relaxed ${highContrast ? 'text-yellow-400' : 'text-gray-700'}`}>
            Point your camera at a complex form, letter, or document. We&apos;ll tell you exactly
            what it is, when it&apos;s due, and what you need to do.
          </p>

          <div className={`border-l-4 p-5 rounded-lg mb-6 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-blue-50 border-blue-500'}`} role="complementary" aria-label="How it works">
            <h3 className={`font-bold mb-2 text-lg ${highContrast ? 'text-yellow-400' : 'text-blue-900'}`}>How it works:</h3>
            <ul className={`list-disc list-inside space-y-2 text-base ${highContrast ? 'text-yellow-400' : 'text-blue-800'}`}>
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
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-6 justify-center">
                <button
                  onClick={speakResults}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${
                    isSpeaking
                      ? 'bg-red-500 text-white'
                      : highContrast ? 'bg-yellow-400 text-black' : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  aria-label={isSpeaking ? 'Stop reading' : 'Read results aloud'}
                  title="Ctrl+R"
                >
                  {isSpeaking ? '⏹️ Stop' : '🔊 Read Aloud'}
                </button>
                <button
                  onClick={() => copyToClipboard(results.action_required)}
                  className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${
                    highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  aria-label="Copy action to clipboard"
                >
                  📋 Copy Action
                </button>
                {results.deadline !== 'None' && (
                  <button
                    onClick={addToCalendar}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${
                      highContrast ? 'bg-yellow-400 text-black' : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                    aria-label="Add deadline to calendar"
                  >
                    📅 Add to Calendar
                  </button>
                )}
              </div>

              {/* Reassurance Message - Displayed FIRST per PRD */}
              <div className={`border-2 p-6 rounded-2xl mb-6 shadow-md ${
                highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-green-50 border-green-400'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden="true">💚</span>
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${highContrast ? 'text-yellow-400' : 'text-green-900'}`}>You&apos;ve Got This!</h2>
                    <p className={`text-xl leading-relaxed ${highContrast ? 'text-yellow-400' : 'text-green-800'}`}>
                      {results.reassurance}
                    </p>
                  </div>
                </div>
              </div>

              {/* What is it? - Summary */}
              <div className={`border-l-4 p-6 rounded-lg mb-6 ${highContrast ? 'bg-gray-900 border-yellow-400' : 'bg-blue-50 border-blue-500'}`}>
                <h3 className={`text-2xl font-bold mb-3 flex items-center gap-2 ${highContrast ? 'text-yellow-400' : 'text-blue-900'}`}>
                  <span aria-hidden="true">📄</span>
                  What is it?
                </h3>
                <p className={`text-xl leading-relaxed ${highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>
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

