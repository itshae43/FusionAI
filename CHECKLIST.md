# Pre-Deployment Checklist

## ✅ Build Verification
- [x] Production build completes successfully (`npm run build`)
- [x] No TypeScript errors
- [x] All API routes compile correctly
- [x] Static pages generate without errors

## 📋 Files Created/Updated

### New Files:
- ✅ `.env.example` - Environment variable template
- ✅ `vercel.json` - Vercel configuration
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `VERCEL_DEPLOY.md` - Quick deploy guide
- ✅ `CHECKLIST.md` - This file
- ✅ `/api/health` - Health check endpoint
- ✅ `/api/delete-file` - File deletion endpoint

### Fixed Files:
- ✅ `src/lib/constants.ts` - Removed invalid INITIAL_FILES
- ✅ `src/lib/supabase.ts` - Better error handling & TypeScript fixes
- ✅ `src/lib/e2b/research.ts` - Added API key validation
- ✅ `src/app/api/chat/route.ts` - Added env validation
- ✅ `next.config.ts` - Production optimizations
- ✅ `src/components/datasets/FileTable.tsx` - Delete functionality
- ✅ `src/app/datasets/page.tsx` - Delete handler integration

## 🔑 Environment Variables Required

Before deploying, ensure you have:

### Essential (Required):
- [ ] `GROQ_API_KEY` - Get from https://console.groq.com
- [ ] `E2B_API_KEY` - Get from https://e2b.dev
- [ ] `EXA_API_KEY` - Get from https://exa.ai
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - From Supabase project

### Optional:
- [ ] `BROWSERBASE_API_KEY`
- [ ] `BROWSERBASE_PROJECT_ID`
- [ ] `GEMINI_API_KEY`

## 🗄️ Database Setup

Ensure Supabase is configured:

- [ ] Created `files` table (see `supabase-schema.sql`)
- [ ] Configured storage bucket named `e2b`
- [ ] Set appropriate RLS policies
- [ ] Verified connection with health check

## 📦 Deployment Steps

### Option 1: Vercel Dashboard
1. [ ] Push code to GitHub
2. [ ] Import project to Vercel
3. [ ] Add environment variables
4. [ ] Deploy

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🧪 Post-Deployment Testing

After deployment, test these features:

### Basic Functionality:
- [ ] Homepage loads (`/`)
- [ ] Chat page loads (`/chat`)
- [ ] Datasets page loads (`/datasets`)
- [ ] Health check passes (`/api/health`)

### Chat Features:
- [ ] Send a regular chat message
- [ ] Get AI response
- [ ] Toggle research mode ON
- [ ] Send research query
- [ ] Verify clickable links in response

### Dataset Features:
- [ ] View existing folders
- [ ] Upload a CSV file
- [ ] File appears in table
- [ ] Change file folder
- [ ] Delete a file
- [ ] Verify file deleted from Supabase

### Analysis Features:
- [ ] Upload CSV with data
- [ ] Ask analysis question in chat
- [ ] Attach CSV file to message
- [ ] Verify analysis runs
- [ ] Check chart renders correctly
- [ ] Test different chart types

### Sidebar Features:
- [ ] Create new chat
- [ ] Create folder
- [ ] Rename folder
- [ ] Drag chat to folder
- [ ] Resize sidebar
- [ ] Chat persistence on refresh

## 🐛 Common Production Issues

### Issue: API routes return 500 errors
**Fix**: Check environment variables are set in Vercel dashboard

### Issue: Supabase connection fails
**Fix**: Verify URL format and keys are correct

### Issue: E2B code execution fails
**Fix**: Check E2B API key and account has credits

### Issue: Research mode doesn't work
**Fix**: Verify EXA_API_KEY is set

### Issue: File upload fails
**Fix**: Check Supabase storage bucket `e2b` exists with proper permissions

### Issue: Build fails
**Fix**: Run `npm run build` locally to see exact error

## 📊 Monitoring Setup

After deployment:

- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (optional: Sentry)
- [ ] Monitor API route performance
- [ ] Check function logs for errors
- [ ] Set up uptime monitoring (optional)

## 🔒 Security Checklist

- [x] `.env` files in `.gitignore`
- [x] API keys not committed to repo
- [x] Using environment variables for secrets
- [x] Supabase RLS policies configured
- [x] Service role key only used server-side
- [ ] Rate limiting considered (future enhancement)
- [ ] CORS configured if needed

## 📝 Documentation

- [x] README.md updated with project info
- [x] DEPLOYMENT.md created with full guide
- [x] VERCEL_DEPLOY.md for quick deploy
- [x] .env.example with all variables
- [x] Supabase schema documented

## 🎯 Performance Optimizations

Applied:
- [x] React strict mode enabled
- [x] Image optimization configured
- [x] Powered-by header removed
- [x] Static page generation where possible
- [x] API route streaming for chat

Future considerations:
- [ ] Add Redis for caching
- [ ] Implement request rate limiting
- [ ] Optimize large CSV handling
- [ ] Add loading skeletons
- [ ] Implement pagination for file lists

## ✨ Ready to Deploy!

If all checks above pass, you're ready to deploy to production! 🚀

**Quick Deploy Command:**
```bash
git add .
git commit -m "Production ready"
git push origin main
# Then import to Vercel dashboard
```

**Verify Health:**
```bash
curl https://your-app.vercel.app/api/health
```

Good luck! 🎉
