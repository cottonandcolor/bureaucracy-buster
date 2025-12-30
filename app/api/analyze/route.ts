import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { imageData, mimeType } = await request.json()

    if (!imageData || !mimeType) {
      return NextResponse.json(
        { error: 'Missing imageData or mimeType' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Convert data URL to base64 if needed
    const base64Data = imageData.includes(',')
      ? imageData.split(',')[1]
      : imageData

    // PRD-aligned prompt: Acts as an "Assistive AI" and enforces JSON output
    const prompt = `You are an Assistive AI helping users with ADHD, Autism, or Dyslexia understand complex documents. Your role is to filter out non-essential text and identify the core intent.

Analyze this document image and provide:

1. **summary**: A one-sentence explanation of what this document is (e.g., "This is a medical bill for services on March 15th")
2. **action_required**: The physical task the user must do (e.g., "Pay $50 by check or online", "Sign bottom of page 2", "Call 555-1234 to confirm appointment")
3. **deadline**: The due date or "None" if no deadline exists (e.g., "Tuesday, January 15th, 2025", "Within 30 days", "None")
4. **reassurance**: An empathetic, supportive message to calm the user (e.g., "You've got this! This is a straightforward task.", "Don't worry - this looks more complicated than it is.")

**CRITICAL**: You MUST respond ONLY with valid JSON in this exact format:
{
  "summary": "one sentence explanation",
  "action_required": "specific physical step",
  "deadline": "date or None",
  "reassurance": "calm, supportive message"
}

Do not include any markdown formatting, code blocks, or extra text. Only return the JSON object.`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ])

    const response = await result.response
    const text = response.text()

    // Parse JSON from response (handle potential markdown wrapping)
    let parsedResponse
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                       text.match(/```\s*([\s\S]*?)\s*```/)
      const jsonText = jsonMatch ? jsonMatch[1] : text
      parsedResponse = JSON.parse(jsonText.trim())

      // Validate required fields
      if (!parsedResponse.summary || !parsedResponse.action_required ||
          !parsedResponse.deadline || !parsedResponse.reassurance) {
        throw new Error('Missing required fields in response')
      }
    } catch (e) {
      console.error('JSON parsing error:', e)
      // Fallback structure
      parsedResponse = {
        summary: text,
        action_required: 'Review the document carefully',
        deadline: 'None',
        reassurance: 'Take your time - we\'re here to help you understand this.'
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze document' },
      { status: 500 }
    )
  }
}
