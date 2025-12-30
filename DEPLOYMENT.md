# Deployment Guide - Bureaucracy Buster

This guide covers deploying Bureaucracy Buster to Vercel for the hackathon demo and beyond.

## Prerequisites

1. **Vercel Account:** Sign up at [vercel.com](https://vercel.com)
2. **Google Gemini API Key:** Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **GitHub Repository:** Your code should be pushed to GitHub

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended for Hackathon)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin master
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables:**
   Before clicking "Deploy", add this environment variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Google Gemini API key (e.g., `AIzaSyCu7K7nceE-RU6ahJYumKy3FvuIm__K9O4`)

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like `https://bureaucracy-buster.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd bureaucracy-buster
   vercel
   ```

4. **Set Environment Variable:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Paste your API key when prompted.

5. **Redeploy with environment variable:**
   ```bash
   vercel --prod
   ```

## Environment Variables

The app requires one environment variable:

| Variable Name | Description | Example | Where Used |
|---------------|-------------|---------|------------|
| `GEMINI_API_KEY` | Google Gemini API key for document analysis | `AIzaSy...` | Server-side API route |

**IMPORTANT:**
- ❌ Do NOT use `NEXT_PUBLIC_GEMINI_API_KEY` in production (exposes key to client)
- ✅ Use `GEMINI_API_KEY` (server-side only, secure)

## Post-Deployment Checklist

After deploying, verify these items:

### 1. Functionality Test
- [ ] Home page loads
- [ ] Camera permission request works on mobile
- [ ] File upload works
- [ ] Document analysis returns results
- [ ] All three key fields display: "What is it?", "When is it due?", "What do I do?"
- [ ] Reassurance message appears first

### 2. Performance Test
- [ ] Analysis completes in < 5 seconds (per PRD requirement)
- [ ] Page loads quickly (< 2 seconds)
- [ ] Images are optimized

### 3. Mobile Test
- [ ] UI is responsive on phone
- [ ] Buttons are large enough to tap (min 44x44px)
- [ ] Camera works on iOS Safari and Android Chrome
- [ ] Text is readable without zooming

### 4. Accessibility Test
- [ ] Screen reader can navigate page
- [ ] All buttons have proper aria-labels
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible

### 5. Security Test
- [ ] API key is NOT visible in browser DevTools
- [ ] API endpoint only accepts POST requests
- [ ] Error messages don't leak sensitive info

## Troubleshooting

### Issue: "API key not configured" error

**Solution:**
1. Check environment variables in Vercel dashboard
2. Ensure variable name is exactly `GEMINI_API_KEY` (no typos)
3. Redeploy after adding environment variable

### Issue: Camera doesn't work

**Possible Causes:**
- Site must be HTTPS (Vercel provides this automatically)
- User must grant camera permission
- Some browsers block camera on third-party domains

**Solution:**
- Vercel deployments are HTTPS by default
- Test on actual device, not desktop browser emulator

### Issue: Analysis is slow (> 5 seconds)

**Possible Causes:**
- Large image file size
- Slow API response from Gemini

**Solutions:**
- Add image compression before upload
- Use `gemini-1.5-flash` model (already configured)
- Consider adding loading states with progress indicator

### Issue: JSON parsing errors

**Possible Causes:**
- Gemini sometimes returns markdown-wrapped JSON
- Non-JSON response from Gemini

**Solutions:**
- Already handled in API route with fallback parsing
- Check logs for specific error messages

## Custom Domain (Optional)

To use a custom domain like `bureaucracybuster.com`:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

## Monitoring and Logs

**View Logs:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on a deployment
3. Click "Functions" tab to see API logs
4. Useful for debugging API errors

**Monitor Usage:**
- Check Google Cloud Console for Gemini API usage
- Free tier: 15 requests per minute
- Consider rate limiting for production

## Cost Considerations

### Vercel Costs
- **Hobby Plan:** Free for personal projects
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Perfect for hackathon!

### Google Gemini API Costs
- **Free Tier:**
  - 15 requests/minute
  - 1,500 requests/day
  - More than enough for hackathon demo
- **Paid Tier:**
  - Very affordable (< $0.01 per request)
  - Consider for production

## Production Considerations

For post-hackathon production deployment:

1. **Rate Limiting:**
   - Add rate limiting to API route
   - Prevent abuse of Gemini API

2. **Image Optimization:**
   - Compress images before sending to API
   - Limit file size to 5MB

3. **Caching:**
   - Consider caching common document types
   - Reduce API calls

4. **Analytics:**
   - Add analytics (Vercel Analytics, Google Analytics)
   - Track success/failure rates

5. **Error Tracking:**
   - Integrate Sentry or similar
   - Monitor API errors

6. **User Privacy:**
   - Add privacy policy
   - Clarify that images are not stored
   - Consider GDPR compliance if serving EU users

## Hackathon Demo Tips

1. **Pre-load test images** on your phone for reliable demo
2. **Have backup screenshots** of expected results
3. **Test on venue WiFi** before presenting
4. **Use airplane mode** with mobile hotspot if venue WiFi is unreliable
5. **Prepare printed documents** as physical props
6. **Have the Vercel URL as a QR code** for judges to scan

## Support

If you encounter issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Check [Google AI Documentation](https://ai.google.dev/docs)

## Quick Reference Commands

```bash
# Local development
npm run dev

# Build for production (test locally)
npm run build
npm run start

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs [deployment-url]
```

## Sample Vercel Configuration

The project includes `next.config.js` which is already optimized for Vercel. No additional configuration needed!

## Post-Hackathon Roadmap

Features to add after hackathon (mentioned in PRD):

1. **Calendar Integration**
   - "Add to Google Calendar" button for deadlines
   - Requires Google Calendar API

2. **Voice Mode**
   - Text-to-speech for results
   - Use Web Speech API

3. **Payment Integration**
   - "Pay Now" button for bills
   - Integrate with Stripe/PayPal

4. **Document History**
   - Save analyzed documents
   - Requires database (Vercel KV or Postgres)

5. **Multi-page Support**
   - Analyze multiple pages at once
   - Stitch images together

Good luck with your hackathon! 🚀
