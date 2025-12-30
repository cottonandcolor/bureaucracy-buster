# Quick Deploy Guide - Bureaucracy Buster

## ✅ Current Status
- [x] Git repository initialized
- [x] Initial commit created
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel

---

## 🚀 Quick Deploy Steps

### 1️⃣ Create GitHub Repo (2 minutes)

1. Go to: https://github.com/new
2. Name: `bureaucracy-buster`
3. Description: "Executive Function Copilot - AI-powered document simplifier"
4. Visibility: Public or Private
5. **DON'T** check any initialization boxes
6. Click "Create repository"

### 2️⃣ Push to GitHub (1 minute)

Run these commands in your terminal:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/bureaucracy-buster.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy to Vercel (3 minutes)

1. **Go to:** https://vercel.com/new
2. **Sign in** with GitHub (if not already)
3. **Import** your `bureaucracy-buster` repository
4. **Add Environment Variable:**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyCu7K7nceE-RU6ahJYumKy3FvuIm__K9O4`
   - Environments: All (Production, Preview, Development)
5. **Click:** Deploy

### 4️⃣ Test (1 minute)

Once deployed:
1. Click "Visit" to open your app
2. Upload a test image (any document photo)
3. Verify results display correctly

---

## 🎯 Your API Key

```
GEMINI_API_KEY=AIzaSyCu7K7nceE-RU6ahJYumKy3FvuIm__K9O4
```

**Important:** This goes in Vercel's environment variables, NOT in your code!

**Security Note:** After your hackathon/demo, consider rotating this key since it was shared publicly.

---

## 🆘 Troubleshooting

### "API key not configured" error
**Solution:** Make sure you added `GEMINI_API_KEY` in Vercel dashboard
- Go to: Project Settings → Environment Variables
- Add the key and redeploy

### Build fails
**Solution:** Check Vercel build logs for specific error
- Usually means missing dependency or TypeScript error

### Camera doesn't work
**Solution:** Camera only works on HTTPS (Vercel provides this automatically)
- Test on the live Vercel URL, not localhost

---

## 📞 Need Help?

- Check DEPLOYMENT.md for detailed instructions
- Check VALIDATION_REPORT.md for testing checklist
- Check Vercel build logs for errors

---

## ⏱️ Total Time: ~7 minutes

- GitHub setup: 2 min
- Push to GitHub: 1 min
- Vercel setup: 3 min
- Testing: 1 min

---

**You're almost there! Just follow the steps above and you'll be live! 🚀**
