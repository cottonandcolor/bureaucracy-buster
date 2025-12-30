# 🧠 Bureaucracy Buster - Executive Function Copilot

**Tagline:** *Turning Administrative Paralysis into Administrative Clarity*

A Next.js application that helps users with ADHD, Autism, Dyslexia, or anxiety navigate complex documents using AI-powered analysis. Built for the [Hackathon Name] hackathon.

## 🎯 Problem Statement

"Admin Paralysis" affects millions of neurodiverse individuals. Complex documents like medical bills, tax letters, or legal notices contain dense jargon and poor formatting, leading to:

- 🚫 **Avoidance** - Important tasks ignored due to overwhelm
- 😰 **Anxiety** - Fear of "doing it wrong" or missing deadlines
- 💸 **Consequences** - Missed payments or critical dates

## 💡 Solution

Bureaucracy Buster acts as an intermediary layer between users and bureaucratic chaos. It:

1. **Accepts** a photo of any document (bills, letters, forms)
2. **Analyzes** using Google Gemini AI to filter out "fluff" and identify core intent
3. **Simplifies** into three essential questions:
   - 📄 **What is it?**
   - 📅 **When is it due?**
   - ✅ **What do I do?**
4. **Reassures** with empathetic, supportive messaging

## ✨ Key Features

- 📷 **Camera Capture**: Point your phone camera at documents
- 📤 **File Upload**: Upload existing photos or scans
- 🤖 **AI-Powered Analysis**: Google Gemini 1.5 Flash for fast, accurate results
- 💚 **Reassurance First**: Calming message displayed before tasks
- 🎨 **Calming Design**: High-contrast blue theme (#4A90E2) optimized for readability
- ♿ **Accessibility**: ARIA labels, semantic HTML, screen reader support
- 📱 **Mobile-First**: Responsive design with large touch targets
- 🔒 **Privacy-Focused**: Images processed in memory, not stored

## 🎯 Target Audience

**Primary:**
- Individuals with ADHD, Autism, Dyslexia, or Executive Dysfunction
- People experiencing anxiety around administrative tasks

**Secondary:**
- ESL (English as Second Language) speakers who find legalese difficult
- Elderly users needing simplified instructions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (or use Vercel for deployment without local Node)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Development

1. **Install dependencies:**
   ```bash
   cd bureaucracy-buster
   npm install
   ```

2. **Configure environment:**
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```
   ⚠️ **Important:** Use `GEMINI_API_KEY` (not `NEXT_PUBLIC_...`) to keep it secure

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push code to GitHub
2. Import to Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 1.5 Flash
- **Deployment:** Vercel (recommended)

## 📁 Project Structure

```
bureaucracy-buster/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Secure API endpoint for Gemini
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── public/                       # Static assets
├── .env.local                    # Environment variables (not in git)
├── DEPLOYMENT.md                 # Deployment guide
├── TESTING_GUIDE.md              # Testing scenarios
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🎨 Design Principles

Based on PRD requirements:

1. **Visual Hierarchy:** Action required is the most prominent element
2. **Calming Colors:** Blue (#4A90E2) primary, soft orange for urgency
3. **High Contrast:** Ensure readability for users with visual processing differences
4. **Large Touch Targets:** Minimum 44x44px for buttons
5. **Non-Judgmental Tone:** "You've got this!" not "You must do this now!"

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing scenarios.

**Quick Test Checklist:**
- [ ] Upload a medical bill - verify amount and deadline extraction
- [ ] Try a parking ticket - check reassurance message appropriateness
- [ ] Test camera on mobile device
- [ ] Verify analysis completes in < 10 seconds

## 📊 Success Metrics (Hackathon)

- ✅ **Accuracy:** Correctly identify deadline and action in 3 test documents
- ✅ **Speed:** From photo to understanding in < 10 seconds
- ✅ **Usability:** Users can operate without instructions

## 🔮 Future Roadmap

**Post-Hackathon Features (from PRD):**

1. **Calendar Integration** 📅
   - One-click "Add to Google Calendar" for deadlines

2. **Voice Mode** 🔊
   - Text-to-speech for results
   - Audio reassurance

3. **"Do It For Me"** 💳
   - Direct payment integration for bills
   - Form auto-fill for common documents

4. **Document History** 📚
   - Save and track analyzed documents
   - Reminders for upcoming deadlines

5. **Multi-language Support** 🌍
   - Support for non-English documents
   - ESL-friendly explanations

## 🤝 Contributing

This is a hackathon MVP. Contributions welcome for the roadmap features!

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Built with ❤️ for the neurodiversity community

## 🙏 Acknowledgments

- Google Gemini AI for document analysis
- Vercel for hosting
- The ADHD/Autism/Dyslexia communities for inspiring this project

## 📞 Support

For questions or issues:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing guidance
- Open an issue on GitHub

---

**Built with 💙 for the neurodiversity community**

